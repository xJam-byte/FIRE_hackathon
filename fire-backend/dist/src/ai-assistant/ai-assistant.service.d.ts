import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export declare class AiAssistantService {
    private readonly prisma;
    private readonly configService;
    private readonly logger;
    private readonly openai;
    private readonly model;
    private readonly dbSchema;
    constructor(prisma: PrismaService, configService: ConfigService);
    query(question: string): Promise<{
        answer: string;
        data: any[];
        sql: string;
        chartType: string | null;
        chartConfig: any;
    }>;
    private generateSql;
    private interpretResults;
}
