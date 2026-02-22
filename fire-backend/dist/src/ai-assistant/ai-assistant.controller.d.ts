import { AiAssistantService } from './ai-assistant.service';
declare class AiQueryDto {
    question: string;
}
export declare class AiAssistantController {
    private readonly aiAssistantService;
    constructor(aiAssistantService: AiAssistantService);
    query(body: AiQueryDto): Promise<{
        answer: string;
        data: any[];
        sql: string;
        chartType: string | null;
        chartConfig: any;
    }>;
}
export {};
