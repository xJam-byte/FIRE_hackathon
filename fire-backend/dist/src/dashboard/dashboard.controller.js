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
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dashboard_service_1 = require("./dashboard.service");
let DashboardController = class DashboardController {
    dashboardService;
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    getStats() {
        return this.dashboardService.getOverallStats();
    }
    getByType() {
        return this.dashboardService.getByType();
    }
    getByTonality() {
        return this.dashboardService.getByTonality();
    }
    getByLanguage() {
        return this.dashboardService.getByLanguage();
    }
    getByOffice() {
        return this.dashboardService.getByOffice();
    }
    getByManager() {
        return this.dashboardService.getByManager();
    }
    getByCity() {
        return this.dashboardService.getByCity();
    }
    getBySegment() {
        return this.dashboardService.getBySegment();
    }
    getByPriority() {
        return this.dashboardService.getPriorityDistribution();
    }
    getTypeByCityDistribution() {
        return this.dashboardService.getTypeByCityDistribution();
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Общая статистика системы' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('by-type'),
    (0, swagger_1.ApiOperation)({ summary: 'Распределение по типам обращений' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getByType", null);
__decorate([
    (0, common_1.Get)('by-tonality'),
    (0, swagger_1.ApiOperation)({ summary: 'Распределение по тональности' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getByTonality", null);
__decorate([
    (0, common_1.Get)('by-language'),
    (0, swagger_1.ApiOperation)({ summary: 'Распределение по языкам обращений' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getByLanguage", null);
__decorate([
    (0, common_1.Get)('by-office'),
    (0, swagger_1.ApiOperation)({ summary: 'Распределение по офисам с нагрузкой' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getByOffice", null);
__decorate([
    (0, common_1.Get)('by-manager'),
    (0, swagger_1.ApiOperation)({ summary: 'Нагрузка по менеджерам' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getByManager", null);
__decorate([
    (0, common_1.Get)('by-city'),
    (0, swagger_1.ApiOperation)({ summary: 'Распределение обращений по городам' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getByCity", null);
__decorate([
    (0, common_1.Get)('by-segment'),
    (0, swagger_1.ApiOperation)({ summary: 'Распределение по сегментам клиентов' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getBySegment", null);
__decorate([
    (0, common_1.Get)('by-priority'),
    (0, swagger_1.ApiOperation)({ summary: 'Распределение по приоритетам' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getByPriority", null);
__decorate([
    (0, common_1.Get)('type-by-city'),
    (0, swagger_1.ApiOperation)({
        summary: 'Распределение типов обращений по городам (кросс-таблица)',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getTypeByCityDistribution", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)('dashboard'),
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map