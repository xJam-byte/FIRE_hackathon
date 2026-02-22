"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const csv_import_module_1 = require("./csv-import/csv-import.module");
const tickets_module_1 = require("./tickets/tickets.module");
const managers_module_1 = require("./managers/managers.module");
const business_units_module_1 = require("./business-units/business-units.module");
const ai_analysis_module_1 = require("./ai-analysis/ai-analysis.module");
const routing_module_1 = require("./routing/routing.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const ai_assistant_module_1 = require("./ai-assistant/ai-assistant.module");
const analytics_module_1 = require("./analytics/analytics.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            prisma_module_1.PrismaModule,
            csv_import_module_1.CsvImportModule,
            tickets_module_1.TicketsModule,
            managers_module_1.ManagersModule,
            business_units_module_1.BusinessUnitsModule,
            ai_analysis_module_1.AiAnalysisModule,
            routing_module_1.RoutingModule,
            dashboard_module_1.DashboardModule,
            ai_assistant_module_1.AiAssistantModule,
            analytics_module_1.AnalyticsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map