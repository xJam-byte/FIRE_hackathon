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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const sync_1 = require("csv-parse/sync");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
require("dotenv/config");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
function getField(record, ...keys) {
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
function parseCsv(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
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
async function seed() {
    console.log('Starting seed...');
    const dataDir = path.resolve(__dirname, '..', '..');
    const buPath = path.join(dataDir, 'business_units.csv');
    const mgrPath = path.join(dataDir, 'managers.csv');
    const tktPath = path.join(dataDir, 'tickets.csv');
    await prisma.assignment.deleteMany();
    await prisma.aiAnalysis.deleteMany();
    await prisma.ticket.deleteMany();
    await prisma.manager.deleteMany();
    await prisma.businessUnit.deleteMany();
    console.log('Cleared existing data');
    if (fs.existsSync(buPath)) {
        const records = parseCsv(buPath);
        let count = 0;
        for (const record of records) {
            const name = getField(record, 'Офис', 'Office', 'name');
            const address = getField(record, 'Адрес', 'Address', 'address');
            if (!name)
                continue;
            await prisma.businessUnit.create({ data: { name, address } });
            count++;
        }
        console.log(`Imported ${count} business units`);
    }
    else {
        console.log(`business_units.csv not found at ${buPath}`);
    }
    if (fs.existsSync(mgrPath)) {
        const records = parseCsv(mgrPath);
        let count = 0;
        for (const record of records) {
            const fullName = getField(record, 'ФИО', 'fullName', 'name');
            const position = getField(record, 'Должность', 'Position');
            const skillsRaw = getField(record, 'Навыки', 'Skills');
            const officeName = getField(record, 'Офис', 'Бизнес-единица', 'office');
            const currentLoadRaw = getField(record, 'Количество обращений в работе', 'Кол-во обращений в работе', 'CurrentLoad');
            if (!fullName)
                continue;
            const skills = skillsRaw
                .split(/[,;|]/)
                .map((s) => s.trim())
                .filter((s) => s.length > 0);
            let businessUnit = await prisma.businessUnit.findFirst({
                where: { name: { contains: officeName, mode: 'insensitive' } },
            });
            if (!businessUnit) {
                businessUnit = await prisma.businessUnit.create({
                    data: { name: officeName, address: '' },
                });
            }
            await prisma.manager.create({
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
        console.log(`Imported ${count} managers`);
    }
    else {
        console.log(`managers.csv not found at ${mgrPath}`);
    }
    if (fs.existsSync(tktPath)) {
        const records = parseCsv(tktPath);
        let count = 0;
        for (const record of records) {
            const clientGuid = getField(record, 'GUID клиента', 'GUID', 'clientGuid');
            const gender = getField(record, 'Пол клиента', 'Пол', 'Gender');
            const birthDateRaw = getField(record, 'Дата рождения', 'BirthDate');
            const segment = getField(record, 'Сегмент клиента', 'Сегмент', 'Segment') || 'Mass';
            const description = getField(record, 'Описание', 'Description');
            const attachments = getField(record, 'Вложения', 'Attachments');
            const country = getField(record, 'Страна', 'Country');
            const region = getField(record, 'Область', 'Region');
            const city = getField(record, 'Населённый пункт', 'Населенный пункт', 'City');
            const street = getField(record, 'Улица', 'Street');
            const house = getField(record, 'Дом', 'House');
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
            await prisma.ticket.create({
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
        console.log(`Imported ${count} tickets`);
    }
    else {
        console.log(`tickets.csv not found at ${tktPath}`);
    }
    console.log('Seed completed!');
}
seed()
    .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
});
//# sourceMappingURL=seed.js.map