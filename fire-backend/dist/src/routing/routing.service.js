"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RoutingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ai_analysis_service_1 = require("../ai-analysis/ai-analysis.service");
const geocoding_service_1 = require("../ai-analysis/geocoding.service");
const geolib = __importStar(require("geolib"));
const ASTANA_NAMES = ['астана', 'astana', 'нур-султан', 'nur-sultan'];
const ALMATY_NAMES = ['алматы', 'almaty', 'алма-ата'];
let RoutingService = RoutingService_1 = class RoutingService {
    prisma;
    aiAnalysisService;
    geocodingService;
    logger = new common_1.Logger(RoutingService_1.name);
    roundRobinCounters = new Map();
    constructor(prisma, aiAnalysisService, geocodingService) {
        this.prisma = prisma;
        this.aiAnalysisService = aiAnalysisService;
        this.geocodingService = geocodingService;
    }
    async processAllTickets() {
        const unassignedTickets = await this.prisma.ticket.findMany({
            where: { assignment: null },
            include: { aiAnalysis: true },
        });
        this.logger.log(`Processing ${unassignedTickets.length} unassigned tickets`);
        let analyzed = 0;
        let assigned = 0;
        let errors = 0;
        await this.geocodeBusinessUnits();
        for (const ticket of unassignedTickets) {
            try {
                let analysis = ticket.aiAnalysis;
                if (!analysis) {
                    analysis = await this.aiAnalysisService.analyzeTicket(ticket.id);
                    analyzed++;
                }
                await this.assignTicket(ticket.id, analysis);
                assigned++;
            }
            catch (error) {
                errors++;
                this.logger.error(`Failed to process ticket ${ticket.id}: ${error}`);
            }
        }
        this.logger.log(`Processing complete: analyzed=${analyzed}, assigned=${assigned}, errors=${errors}`);
        return {
            total: unassignedTickets.length,
            analyzed,
            assigned,
            errors,
        };
    }
    async geocodeBusinessUnits() {
        const units = await this.prisma.businessUnit.findMany({
            where: {
                OR: [{ latitude: null }, { longitude: null }],
            },
        });
        for (const unit of units) {
            if (unit.address) {
                const coords = await this.geocodingService.geocode(unit.address);
                if (coords) {
                    await this.prisma.businessUnit.update({
                        where: { id: unit.id },
                        data: { latitude: coords.latitude, longitude: coords.longitude },
                    });
                    this.logger.log(`Geocoded business unit "${unit.name}" → [${coords.latitude}, ${coords.longitude}]`);
                }
            }
        }
    }
    async assignTicket(ticketId, analysis) {
        const ticket = await this.prisma.ticket.findUnique({
            where: { id: ticketId },
        });
        if (!ticket)
            throw new Error(`Ticket ${ticketId} not found`);
        const allUnits = await this.prisma.businessUnit.findMany({
            include: { managers: true },
        });
        const targetUnit = this.findTargetBusinessUnit(analysis, allUnits);
        if (!targetUnit) {
            throw new Error(`No suitable business unit found for ticket ${ticketId}`);
        }
        let candidateManagers = targetUnit.managers;
        candidateManagers = this.filterByCompetencies(candidateManagers, ticket.segment, analysis.type, analysis.language);
        if (candidateManagers.length === 0) {
            for (const unit of allUnits) {
                if (unit.id === targetUnit.id)
                    continue;
                const fallbackCandidates = this.filterByCompetencies(unit.managers, ticket.segment, analysis.type, analysis.language);
                if (fallbackCandidates.length > 0) {
                    candidateManagers = fallbackCandidates;
                    this.logger.warn(`Fallback: using managers from "${unit.name}" for ticket ${ticketId}`);
                    break;
                }
            }
        }
        if (candidateManagers.length === 0) {
            throw new Error(`No suitable manager found for ticket ${ticketId} (segment=${ticket.segment}, type=${analysis.type}, lang=${analysis.language})`);
        }
        candidateManagers.sort((a, b) => a.currentLoad - b.currentLoad);
        const topTwo = candidateManagers.slice(0, 2);
        const selectedManager = this.roundRobinSelect(topTwo, targetUnit.id);
        const reasons = [];
        reasons.push(`Офис: ${targetUnit.name}`);
        if (['VIP', 'Priority'].includes(ticket.segment))
            reasons.push(`Сегмент ${ticket.segment} → навык VIP`);
        if (analysis.type === 'Смена данных')
            reasons.push('Тип "Смена данных" → Глав спец');
        if (['KZ', 'ENG'].includes(analysis.language))
            reasons.push(`Язык ${analysis.language} → навык ${analysis.language}`);
        reasons.push(`Нагрузка менеджера: ${selectedManager.currentLoad}`);
        await this.prisma.$transaction([
            this.prisma.assignment.create({
                data: {
                    ticketId,
                    managerId: selectedManager.id,
                    businessUnitId: targetUnit.id,
                    reason: reasons.join('; '),
                },
            }),
            this.prisma.manager.update({
                where: { id: selectedManager.id },
                data: { currentLoad: { increment: 1 } },
            }),
            this.prisma.ticket.update({
                where: { id: ticketId },
                data: { status: 'assigned' },
            }),
        ]);
        this.logger.log(`Ticket ${ticketId} assigned to ${selectedManager.fullName} (${targetUnit.name})`);
    }
    findTargetBusinessUnit(analysis, allUnits) {
        if (!analysis.latitude || !analysis.longitude) {
            return this.splitAstanaAlmaty(allUnits);
        }
        const isKazakhstanCoords = analysis.latitude >= 40 &&
            analysis.latitude <= 56 &&
            analysis.longitude >= 46 &&
            analysis.longitude <= 88;
        if (!isKazakhstanCoords) {
            return this.splitAstanaAlmaty(allUnits);
        }
        const unitsWithCoords = allUnits.filter((u) => u.latitude != null && u.longitude != null);
        if (unitsWithCoords.length === 0) {
            return this.splitAstanaAlmaty(allUnits);
        }
        let nearestUnit = unitsWithCoords[0];
        let minDistance = Infinity;
        for (const unit of unitsWithCoords) {
            const distance = geolib.getDistance({ latitude: analysis.latitude, longitude: analysis.longitude }, { latitude: unit.latitude, longitude: unit.longitude });
            if (distance < minDistance) {
                minDistance = distance;
                nearestUnit = unit;
            }
        }
        return nearestUnit;
    }
    splitAstanaAlmaty(allUnits) {
        const astanaUnit = allUnits.find((u) => ASTANA_NAMES.some((name) => u.name.toLowerCase().includes(name)));
        const almatyUnit = allUnits.find((u) => ALMATY_NAMES.some((name) => u.name.toLowerCase().includes(name)));
        if (astanaUnit && almatyUnit) {
            const key = 'astana-almaty-split';
            const counter = this.roundRobinCounters.get(key) || 0;
            this.roundRobinCounters.set(key, counter + 1);
            return counter % 2 === 0 ? astanaUnit : almatyUnit;
        }
        return astanaUnit || almatyUnit || allUnits[0];
    }
    filterByCompetencies(managers, segment, ticketType, language) {
        let filtered = [...managers];
        if (segment === 'VIP' || segment === 'Priority') {
            filtered = filtered.filter((m) => m.skills.some((s) => s.toUpperCase() === 'VIP'));
        }
        if (ticketType === 'Смена данных') {
            filtered = filtered.filter((m) => m.position.toLowerCase().includes('глав') ||
                m.position.toLowerCase().includes('главный') ||
                m.position.toLowerCase() === 'глав спец');
        }
        if (language === 'KZ') {
            filtered = filtered.filter((m) => m.skills.some((s) => s.toUpperCase() === 'KZ'));
        }
        else if (language === 'ENG') {
            filtered = filtered.filter((m) => m.skills.some((s) => s.toUpperCase() === 'ENG'));
        }
        return filtered;
    }
    roundRobinSelect(managers, unitId) {
        if (managers.length === 1)
            return managers[0];
        const key = `unit-${unitId}-${managers
            .map((m) => m.id)
            .sort()
            .join('-')}`;
        const counter = this.roundRobinCounters.get(key) || 0;
        const selected = managers[counter % managers.length];
        this.roundRobinCounters.set(key, counter + 1);
        return selected;
    }
    async getAssignments(query) {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (query.businessUnitId)
            where.businessUnitId = query.businessUnitId;
        if (query.managerId)
            where.managerId = query.managerId;
        const [data, total] = await Promise.all([
            this.prisma.assignment.findMany({
                where,
                skip,
                take: limit,
                orderBy: { assignedAt: 'desc' },
                include: {
                    ticket: {
                        include: { aiAnalysis: true },
                    },
                    manager: true,
                    businessUnit: true,
                },
            }),
            this.prisma.assignment.count({ where }),
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
};
exports.RoutingService = RoutingService;
exports.RoutingService = RoutingService = RoutingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_analysis_service_1.AiAnalysisService,
        geocoding_service_1.GeocodingService])
], RoutingService);
//# sourceMappingURL=routing.service.js.map