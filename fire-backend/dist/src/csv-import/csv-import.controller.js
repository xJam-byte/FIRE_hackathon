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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvImportController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const csv_import_service_1 = require("./csv-import.service");
const path = __importStar(require("path"));
let CsvImportController = class CsvImportController {
    csvImportService;
    constructor(csvImportService) {
        this.csvImportService = csvImportService;
    }
    async importCsv(files) {
        return this.csvImportService.importAll({
            tickets: files.tickets?.[0],
            managers: files.managers?.[0],
            businessUnits: files.businessUnits?.[0],
        });
    }
    async seedFromFiles() {
        const rootDir = path.resolve(__dirname, '..', '..', '..');
        return this.csvImportService.importFromPaths({
            businessUnitsPath: path.join(rootDir, 'business_units.csv'),
            managersPath: path.join(rootDir, 'managers.csv'),
            ticketsPath: path.join(rootDir, 'tickets.csv'),
        });
    }
};
exports.CsvImportController = CsvImportController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Импорт данных из CSV файлов (tickets, managers, business units)',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                tickets: {
                    type: 'string',
                    format: 'binary',
                    description: 'CSV файл с обращениями',
                },
                managers: {
                    type: 'string',
                    format: 'binary',
                    description: 'CSV файл с менеджерами',
                },
                businessUnits: {
                    type: 'string',
                    format: 'binary',
                    description: 'CSV файл с офисами',
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'tickets', maxCount: 1 },
        { name: 'managers', maxCount: 1 },
        { name: 'businessUnits', maxCount: 1 },
    ])),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CsvImportController.prototype, "importCsv", null);
__decorate([
    (0, common_1.Post)('seed'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'Импорт данных из CSV файлов, расположенных в корне проекта (auto-seed)',
        description: 'Автоматически находит business_units.csv, managers.csv и tickets.csv в папке datasour и импортирует',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CsvImportController.prototype, "seedFromFiles", null);
exports.CsvImportController = CsvImportController = __decorate([
    (0, swagger_1.ApiTags)('import'),
    (0, common_1.Controller)('import'),
    __metadata("design:paramtypes", [csv_import_service_1.CsvImportService])
], CsvImportController);
//# sourceMappingURL=csv-import.controller.js.map