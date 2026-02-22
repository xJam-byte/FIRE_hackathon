"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const openai_1 = __importDefault(require("openai"));
let AnalyticsService = AnalyticsService_1 = class AnalyticsService {
    prisma;
    configService;
    logger = new common_1.Logger(AnalyticsService_1.name);
    openai;
    model;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.openai = new openai_1.default({
            apiKey: this.configService.get('OPENAI_API_KEY'),
            baseURL: this.configService.get('OPENAI_BASE_URL', 'https://api.openai.com/v1'),
        });
        this.model = this.configService.get('OPENAI_MODEL', 'gpt-4o-mini');
    }
    async getFullAnalytics() {
        this.logger.log('Generating full analytics report...');
        const [topProblems, tonalityBreakdown, priorityBreakdown, segmentBreakdown, languageBreakdown, cityBreakdown, managerLoad, officeLoad, overallStats, recentTrends, highPriorityTickets,] = await Promise.all([
            this.getTopProblems(),
            this.getTonalityBreakdown(),
            this.getPriorityBreakdown(),
            this.getSegmentBreakdown(),
            this.getLanguageBreakdown(),
            this.getCityBreakdown(),
            this.getManagerLoad(),
            this.getOfficeLoad(),
            this.getOverallStats(),
            this.getRecentTrends(),
            this.getHighPriorityTickets(),
        ]);
        return {
            overallStats,
            topProblems,
            tonalityBreakdown,
            priorityBreakdown,
            segmentBreakdown,
            languageBreakdown,
            cityBreakdown,
            managerLoad,
            officeLoad,
            recentTrends,
            highPriorityTickets,
        };
    }
    async getAiRecommendations() {
        this.logger.log('Generating AI recommendations...');
        const analytics = await this.getFullAnalytics();
        const prompt = `Ты — старший аналитик системы обработки обращений клиентов банка. Проанализируй следующую статистику и дай подробные рекомендации для администраторов.

Статистика:
- Всего обращений: ${analytics.overallStats.totalTickets}
- Проанализировано AI: ${analytics.overallStats.analyzedTickets}
- Назначено: ${analytics.overallStats.assignedTickets}
- В ожидании: ${analytics.overallStats.pendingTickets}
- Менеджеров: ${analytics.overallStats.totalManagers}
- Офисов: ${analytics.overallStats.totalBusinessUnits}

Топ проблем (по количеству):
${analytics.topProblems.map((p) => `  - ${p.type}: ${p.count} обращений (${p.percentage}%)`).join('\n')}

Тональность обращений:
${analytics.tonalityBreakdown.map((t) => `  - ${t.tonality}: ${t.count} (${t.percentage}%)`).join('\n')}

Распределение приоритетов:
${analytics.priorityBreakdown.map((p) => `  - Приоритет ${p.priority}: ${p.count} обращений`).join('\n')}

Нагрузка менеджеров (топ-5):
${analytics.managerLoad
            .slice(0, 5)
            .map((m) => `  - ${m.fullName}: нагрузка ${m.currentLoad}, назначений ${m.assignmentsCount}`)
            .join('\n')}

Нагрузка офисов:
${analytics.officeLoad.map((o) => `  - ${o.name}: ${o.managersCount} менеджеров, ${o.assignmentsCount} назначений, общая нагрузка ${o.totalLoad}`).join('\n')}

Города с наибольшим количеством обращений:
${analytics.cityBreakdown
            .slice(0, 5)
            .map((c) => `  - ${c.city}: ${c.count}`)
            .join('\n')}

Обращения высокого приоритета (8-10): ${analytics.highPriorityTickets.length}

Дай 5-7 конкретных, actionable рекомендаций для администраторов в формате JSON:
{
  "summary": "Краткий обзор ситуации (2-3 предложения)",
  "recommendations": [
    {
      "title": "Заголовок рекомендации",
      "description": "Подробное описание",
      "priority": "high|medium|low",
      "category": "staffing|process|quality|technology|training"
    }
  ],
  "risks": [
    {
      "title": "Название риска",
      "description": "Описание и как избежать",
      "severity": "critical|high|medium|low"
    }
  ],
  "kpis": [
    {
      "name": "Название метрики",
      "value": "текущее значение",
      "target": "целевое значение",
      "status": "good|warning|critical"
    }
  ]
}

Ответь ТОЛЬКО JSON, без markdown.`;
        try {
            const response = await this.openai.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a senior business analyst. Always respond with valid JSON only, no markdown formatting.',
                    },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.3,
                max_tokens: 2000,
            });
            const content = response.choices[0]?.message?.content?.trim() || '';
            const cleaned = content
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();
            const aiReport = JSON.parse(cleaned);
            return {
                ...analytics,
                aiReport,
            };
        }
        catch (error) {
            this.logger.error(`AI recommendations failed: ${error}`);
            return {
                ...analytics,
                aiReport: {
                    summary: 'Не удалось сгенерировать AI-рекомендации. Пожалуйста, попробуйте позже.',
                    recommendations: [],
                    risks: [],
                    kpis: [],
                },
            };
        }
    }
    async getTopProblems() {
        const results = await this.prisma.aiAnalysis.groupBy({
            by: ['type'],
            _count: true,
            orderBy: { _count: { type: 'desc' } },
        });
        const total = results.reduce((s, r) => s + r._count, 0);
        return results.map((r) => ({
            type: r.type,
            count: r._count,
            percentage: total > 0 ? Math.round((r._count / total) * 100) : 0,
        }));
    }
    async getTonalityBreakdown() {
        const results = await this.prisma.aiAnalysis.groupBy({
            by: ['tonality'],
            _count: true,
            orderBy: { _count: { tonality: 'desc' } },
        });
        const total = results.reduce((s, r) => s + r._count, 0);
        return results.map((r) => ({
            tonality: r.tonality,
            count: r._count,
            percentage: total > 0 ? Math.round((r._count / total) * 100) : 0,
        }));
    }
    async getPriorityBreakdown() {
        const results = await this.prisma.aiAnalysis.groupBy({
            by: ['priority'],
            _count: true,
            orderBy: { priority: 'asc' },
        });
        return results.map((r) => ({
            priority: r.priority,
            count: r._count,
        }));
    }
    async getSegmentBreakdown() {
        const results = await this.prisma.ticket.groupBy({
            by: ['segment'],
            _count: true,
            orderBy: { _count: { segment: 'desc' } },
        });
        const total = results.reduce((s, r) => s + r._count, 0);
        return results.map((r) => ({
            segment: r.segment,
            count: r._count,
            percentage: total > 0 ? Math.round((r._count / total) * 100) : 0,
        }));
    }
    async getLanguageBreakdown() {
        const results = await this.prisma.aiAnalysis.groupBy({
            by: ['language'],
            _count: true,
            orderBy: { _count: { language: 'desc' } },
        });
        return results.map((r) => ({
            language: r.language,
            count: r._count,
        }));
    }
    async getCityBreakdown() {
        const tickets = await this.prisma.ticket.findMany({
            where: { city: { not: null } },
            select: { city: true },
        });
        const cityMap = new Map();
        for (const t of tickets) {
            if (t.city) {
                const city = t.city.trim();
                cityMap.set(city, (cityMap.get(city) || 0) + 1);
            }
        }
        return Array.from(cityMap.entries())
            .map(([city, count]) => ({ city, count }))
            .sort((a, b) => b.count - a.count);
    }
    async getManagerLoad() {
        const managers = await this.prisma.manager.findMany({
            include: {
                businessUnit: { select: { name: true } },
                _count: { select: { assignments: true } },
            },
            orderBy: { currentLoad: 'desc' },
        });
        return managers.map((m) => ({
            id: m.id,
            fullName: m.fullName,
            position: m.position,
            skills: m.skills,
            office: m.businessUnit.name,
            currentLoad: m.currentLoad,
            assignmentsCount: m._count.assignments,
        }));
    }
    async getOfficeLoad() {
        const units = await this.prisma.businessUnit.findMany({
            include: {
                _count: { select: { managers: true, assignments: true } },
                managers: { select: { currentLoad: true } },
            },
        });
        return units.map((u) => ({
            id: u.id,
            name: u.name,
            address: u.address,
            managersCount: u._count.managers,
            assignmentsCount: u._count.assignments,
            totalLoad: u.managers.reduce((sum, m) => sum + m.currentLoad, 0),
        }));
    }
    async getOverallStats() {
        const [totalTickets, analyzedTickets, assignedTickets, totalManagers, totalBusinessUnits,] = await Promise.all([
            this.prisma.ticket.count(),
            this.prisma.aiAnalysis.count(),
            this.prisma.assignment.count(),
            this.prisma.manager.count(),
            this.prisma.businessUnit.count(),
        ]);
        return {
            totalTickets,
            analyzedTickets,
            assignedTickets,
            pendingTickets: totalTickets - assignedTickets,
            totalManagers,
            totalBusinessUnits,
        };
    }
    async getRecentTrends() {
        const tickets = await this.prisma.ticket.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: {
                aiAnalysis: { select: { type: true, tonality: true, priority: true } },
            },
        });
        const avgPriority = tickets.length > 0
            ? Math.round((tickets.reduce((s, t) => s + (t.aiAnalysis?.priority || 0), 0) /
                tickets.filter((t) => t.aiAnalysis).length) *
                10) / 10
            : 0;
        const negativeCount = tickets.filter((t) => t.aiAnalysis?.tonality === 'Негативный').length;
        const negativePct = tickets.length > 0
            ? Math.round((negativeCount / tickets.length) * 100)
            : 0;
        return {
            avgPriority,
            negativePercentage: negativePct,
            totalRecent: tickets.length,
        };
    }
    async getHighPriorityTickets() {
        return this.prisma.ticket.findMany({
            where: {
                aiAnalysis: { priority: { gte: 8 } },
            },
            include: {
                aiAnalysis: true,
                assignment: {
                    include: {
                        manager: { select: { fullName: true } },
                        businessUnit: { select: { name: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
        });
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = AnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map