import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { GeocodingService } from './geocoding.service';
export declare class AiAnalysisService {
    private readonly prisma;
    private readonly configService;
    private readonly geocodingService;
    private readonly logger;
    private readonly openai;
    private readonly model;
    constructor(prisma: PrismaService, configService: ConfigService, geocodingService: GeocodingService);
    analyzeTicket(ticketId: number): Promise<any>;
    analyzeAllPending(): Promise<{
        analyzed: number;
        errors: number;
    }>;
    private callLlm;
}
