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
var CsvImportService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvImportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const sync_1 = require("csv-parse/sync");
let CsvImportService = CsvImportService_1 = class CsvImportService {
    prisma;
    logger = new common_1.Logger(CsvImportService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async importAll(files) {
        const results = {
            businessUnits: 0,
            managers: 0,
            tickets: 0,
        };
        if (files.businessUnits) {
            results.businessUnits = await this.importBusinessUnits(files.businessUnits);
        }
        if (files.managers) {
            results.managers = await this.importManagers(files.managers);
        }
        if (files.tickets) {
            results.tickets = await this.importTickets(files.tickets);
        }
        return {
            message: 'Import completed successfully',
            imported: results,
        };
    }
    async importFromPaths(paths) {
        const fs = await import('fs');
        const results = { businessUnits: 0, managers: 0, tickets: 0 };
        if (paths.businessUnitsPath && fs.existsSync(paths.businessUnitsPath)) {
            const buffer = fs.readFileSync(paths.businessUnitsPath);
            results.businessUnits = await this.importBusinessUnits({
                buffer,
            });
        }
        if (paths.managersPath && fs.existsSync(paths.managersPath)) {
            const buffer = fs.readFileSync(paths.managersPath);
            results.managers = await this.importManagers({
                buffer,
            });
        }
        if (paths.ticketsPath && fs.existsSync(paths.ticketsPath)) {
            const buffer = fs.readFileSync(paths.ticketsPath);
            results.tickets = await this.importTickets({
                buffer,
            });
        }
        return { message: 'Import from files completed', imported: results };
    }
    getField(record, ...keys) {
        for (const key of keys) {
            const val = record[key];
            if (val !== undefined && val !== null)
                return val.trim();
        }
        for (const recordKey of Object.keys(record)) {
            const trimmedKey = recordKey.trim();
            for (const key of keys) {
                if (trimmedKey === key.trim()) {
                    const val = record[recordKey];
                    if (val !== undefined && val !== null)
                        return val.trim();
                }
            }
        }
        return '';
    }
    parseCsv(file) {
        const content = file.buffer.toString('utf-8');
        return (0, sync_1.parse)(content, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
            bom: true,
            delimiter: ',',
            relax_quotes: true,
            relax_column_count: true,
        });
    }
    async importBusinessUnits(file) {
        const records = this.parseCsv(file);
        this.logger.log(`Parsing ${records.length} business units`);
        let count = 0;
        for (const record of records) {
            const name = this.getField(record, 'Офис', 'Office', 'name');
            const address = this.getField(record, 'Адрес', 'Address', 'address');
            if (!name)
                continue;
            await this.prisma.businessUnit.create({
                data: { name, address },
            });
            count++;
        }
        this.logger.log(`Imported ${count} business units`);
        return count;
    }
    async importManagers(file) {
        const records = this.parseCsv(file);
        this.logger.log(`Parsing ${records.length} managers`);
        let count = 0;
        for (const record of records) {
            const fullName = this.getField(record, 'ФИО', 'fullName', 'name');
            const position = this.getField(record, 'Должность', 'Position', 'position');
            const skillsRaw = this.getField(record, 'Навыки', 'Skills', 'skills');
            const officeName = this.getField(record, 'Офис', 'Бизнес-единица', 'BusinessUnit', 'office');
            const currentLoadRaw = this.getField(record, 'Количество обращений в работе', 'Кол-во обращений в работе', 'CurrentLoad', 'currentLoad');
            if (!fullName)
                continue;
            const skills = skillsRaw
                .split(/[,;|]/)
                .map((s) => s.trim())
                .filter((s) => s.length > 0);
            let businessUnit = await this.prisma.businessUnit.findFirst({
                where: { name: { contains: officeName, mode: 'insensitive' } },
            });
            if (!businessUnit) {
                businessUnit = await this.prisma.businessUnit.create({
                    data: { name: officeName, address: '' },
                });
            }
            await this.prisma.manager.create({
                data: {
                    fullName,
                    position,
                    skills,
                    businessUnitId: businessUnit.id,
                    currentLoad: parseInt(currentLoadRaw, 10) || 0,
                },
            });
            count++;
        }
        this.logger.log(`Imported ${count} managers`);
        return count;
    }
    async importTickets(file) {
        const records = this.parseCsv(file);
        this.logger.log(`Parsing ${records.length} tickets`);
        let count = 0;
        for (const record of records) {
            const clientGuid = this.getField(record, 'GUID клиента', 'GUID', 'clientGuid', 'guid');
            const gender = this.getField(record, 'Пол клиента', 'Пол', 'Gender', 'gender');
            const birthDateRaw = this.getField(record, 'Дата рождения', 'BirthDate', 'birthDate');
            const segment = this.getField(record, 'Сегмент клиента', 'Сегмент', 'Segment', 'segment') || 'Mass';
            const description = this.getField(record, 'Описание', 'Description', 'description');
            const attachments = this.getField(record, 'Вложения', 'Attachments', 'attachments');
            const country = this.getField(record, 'Страна', 'Country', 'country');
            const region = this.getField(record, 'Область', 'Region', 'region');
            const city = this.getField(record, 'Населённый пункт', 'Населенный пункт', 'City', 'city');
            const street = this.getField(record, 'Улица', 'Street', 'street');
            const house = this.getField(record, 'Дом', 'House', 'house');
            if (!clientGuid && !description)
                continue;
            let birthDate = null;
            if (birthDateRaw) {
                try {
                    birthDate = new Date(birthDateRaw);
                    if (isNaN(birthDate.getTime()))
                        birthDate = null;
                }
                catch {
                    birthDate = null;
                }
            }
            await this.prisma.ticket.create({
                data: {
                    clientGuid,
                    gender: gender || null,
                    birthDate,
                    segment,
                    description,
                    attachments: attachments || null,
                    country: country || null,
                    region: region || null,
                    city: city || null,
                    street: street || null,
                    house: house || null,
                    status: 'new',
                },
            });
            count++;
        }
        this.logger.log(`Imported ${count} tickets`);
        return count;
    }
};
exports.CsvImportService = CsvImportService;
exports.CsvImportService = CsvImportService = CsvImportService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CsvImportService);
//# sourceMappingURL=csv-import.service.js.map