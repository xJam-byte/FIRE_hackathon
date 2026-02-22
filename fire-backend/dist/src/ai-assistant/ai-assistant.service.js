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
var AiAssistantService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiAssistantService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const openai_1 = __importDefault(require("openai"));
let AiAssistantService = AiAssistantService_1 = class AiAssistantService {
    prisma;
    configService;
    logger = new common_1.Logger(AiAssistantService_1.name);
    openai;
    model;
    dbSchema = `
Database tables and their columns:

1. tickets (id, clientGuid, gender, birthDate, segment, description, attachments, country, region, city, street, house, status, createdAt, updatedAt)
2. ai_analyses (id, ticketId, type, tonality, priority, language, summary, latitude, longitude, createdAt, updatedAt)
3. assignments (id, ticketId, managerId, businessUnitId, reason, assignedAt)
4. managers (id, fullName, position, skills, businessUnitId, currentLoad, createdAt, updatedAt)
5. business_units (id, name, address, latitude, longitude, createdAt, updatedAt)

Relations:
- tickets.id = ai_analyses.ticketId (one-to-one)
- tickets.id = assignments.ticketId (one-to-one)
- managers.id = assignments.managerId (one-to-many)
- business_units.id = managers.businessUnitId (one-to-many)
- business_units.id = assignments.businessUnitId (one-to-many)

ticket.segment values: Mass, VIP, Priority
ai_analyses.type values: Жалоба, Смена данных, Консультация, Претензия, Неработоспособность приложения, Мошеннические действия, Спам
ai_analyses.tonality values: Позитивный, Нейтральный, Негативный
ai_analyses.language values: KZ, ENG, RU
ticket.status values: new, analyzed, assigned
manager.position values: Спец, Ведущий спец, Глав спец
manager.skills values: VIP, ENG, KZ
`;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.openai = new openai_1.default({
            apiKey: this.configService.get('OPENAI_API_KEY'),
            baseURL: this.configService.get('OPENAI_BASE_URL', 'https://api.openai.com/v1'),
        });
        this.model = this.configService.get('OPENAI_MODEL', 'gpt-4o-mini');
    }
    async query(question) {
        this.logger.log(`AI Assistant query: "${question}"`);
        const sqlQuery = await this.generateSql(question);
        if (!sqlQuery || !sqlQuery.trim().toUpperCase().startsWith('SELECT')) {
            return {
                answer: 'Не удалось сгенерировать безопасный SQL-запрос для вашего вопроса.',
                data: [],
                sql: '',
                chartType: null,
                chartConfig: null,
            };
        }
        try {
            const data = await this.prisma.$queryRawUnsafe(sqlQuery);
            const serializedData = JSON.parse(JSON.stringify(data, (_, value) => typeof value === 'bigint' ? Number(value) : value));
            const interpretation = await this.interpretResults(question, serializedData);
            return {
                answer: interpretation.answer,
                data: serializedData,
                sql: sqlQuery,
                chartType: interpretation.chartType,
                chartConfig: interpretation.chartConfig,
            };
        }
        catch (error) {
            this.logger.error(`SQL execution failed: ${error}`);
            return {
                answer: `Ошибка выполнения запроса: ${error instanceof Error ? error.message : 'Unknown error'}`,
                data: [],
                sql: sqlQuery,
                chartType: null,
                chartConfig: null,
            };
        }
    }
    async generateSql(question) {
        const systemPrompt = `You are a SQL query generator for a PostgreSQL database. Given a user question in any language, generate a valid PostgreSQL SELECT query.

${this.dbSchema}

Rules:
1. ONLY generate SELECT queries. Never generate INSERT, UPDATE, DELETE, DROP, ALTER, or any other DDL/DML.
2. Always use the exact table and column names from the schema above.
3. Use proper PostgreSQL syntax.
4. Respond with ONLY the SQL query, nothing else. No markdown, no explanation.
5. For aggregation queries, always include meaningful aliases.
6. Limit results to 100 rows max.
7. Use double quotes for column names that are camelCase (e.g., "ticketId", "fullName", "businessUnitId", "currentLoad", "clientGuid", "birthDate", "createdAt", "updatedAt", "assignedAt").
8. Array columns like "skills" use PostgreSQL array syntax.`;
        try {
            const response = await this.openai.chat.completions.create({
                model: this.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: question },
                ],
                temperature: 0,
                max_tokens: 500,
            });
            const sql = response.choices[0]?.message?.content?.trim() || '';
            const cleanedSql = sql
                .replace(/```sql\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();
            if (!cleanedSql.toUpperCase().startsWith('SELECT')) {
                this.logger.warn(`Generated non-SELECT query: ${cleanedSql}`);
                return '';
            }
            const forbidden = [
                'INSERT',
                'UPDATE',
                'DELETE',
                'DROP',
                'ALTER',
                'TRUNCATE',
                'CREATE',
                'GRANT',
                'REVOKE',
            ];
            const upperSql = cleanedSql.toUpperCase();
            for (const word of forbidden) {
                if (upperSql.includes(word) && !upperSql.startsWith('SELECT')) {
                    this.logger.warn(`Forbidden keyword "${word}" found in query`);
                    return '';
                }
            }
            return cleanedSql;
        }
        catch (error) {
            this.logger.error(`SQL generation failed: ${error}`);
            return '';
        }
    }
    async interpretResults(question, data) {
        if (!data || data.length === 0) {
            return {
                answer: 'По вашему запросу данные не найдены.',
                chartType: null,
                chartConfig: null,
            };
        }
        const systemPrompt = `You are a data analyst assistant. Given a user's question and query results, provide:
1. A concise answer in Russian
2. A recommended chart type for visualization (bar, line, pie, table, doughnut, or null if not applicable)
3. A chart configuration with xAxis, yAxis, and groupBy fields matching the data column names

Respond with JSON only:
{
  "answer": "Текстовый ответ на русском",
  "chartType": "bar|line|pie|table|doughnut|null",
  "chartConfig": { "xAxis": "column_name", "yAxis": "column_name", "groupBy": "column_name_or_null" }
}`;
        try {
            const preview = data.slice(0, 10);
            const columns = data.length > 0 ? Object.keys(data[0]) : [];
            const response = await this.openai.chat.completions.create({
                model: this.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    {
                        role: 'user',
                        content: `Question: ${question}\nColumns: ${columns.join(', ')}\nData (first ${preview.length} rows): ${JSON.stringify(preview)}`,
                    },
                ],
                temperature: 0.1,
                max_tokens: 500,
            });
            const content = response.choices[0]?.message?.content?.trim() || '';
            const cleaned = content
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();
            return JSON.parse(cleaned);
        }
        catch (error) {
            this.logger.error(`Result interpretation failed: ${error}`);
            return {
                answer: `Найдено ${data.length} записей по вашему запросу.`,
                chartType: 'table',
                chartConfig: null,
            };
        }
    }
};
exports.AiAssistantService = AiAssistantService;
exports.AiAssistantService = AiAssistantService = AiAssistantService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], AiAssistantService);
//# sourceMappingURL=ai-assistant.service.js.map