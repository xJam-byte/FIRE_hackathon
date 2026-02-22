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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ManagersService = class ManagersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (query.businessUnitId)
            where.businessUnitId = query.businessUnitId;
        if (query.position)
            where.position = query.position;
        const [data, total] = await Promise.all([
            this.prisma.manager.findMany({
                where,
                skip,
                take: limit,
                orderBy: { currentLoad: 'asc' },
                include: {
                    businessUnit: true,
                    _count: { select: { assignments: true } },
                },
            }),
            this.prisma.manager.count({ where }),
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
    async findOne(id) {
        return this.prisma.manager.findUnique({
            where: { id },
            include: {
                businessUnit: true,
                assignments: {
                    include: {
                        ticket: {
                            include: { aiAnalysis: true },
                        },
                    },
                    orderBy: { assignedAt: 'desc' },
                    take: 50,
                },
            },
        });
    }
};
exports.ManagersService = ManagersService;
exports.ManagersService = ManagersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ManagersService);
//# sourceMappingURL=managers.service.js.map