import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { GeocodingService } from './geocoding.service';
import OpenAI from 'openai';

interface AiResult {
  type: string;
  tonality: string;
  priority: number;
  language: string;
  summary: string;
}

@Injectable()
export class AiAnalysisService {
  private readonly logger = new Logger(AiAnalysisService.name);
  private readonly openai: OpenAI;
  private readonly model: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly geocodingService: GeocodingService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
      baseURL: this.configService.get<string>(
        'OPENAI_BASE_URL',
        'https://api.openai.com/v1',
      ),
    });
    this.model = this.configService.get<string>('OPENAI_MODEL', 'gpt-4o-mini');
  }

  async analyzeTicket(ticketId: number): Promise<any> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
    });
    if (!ticket) throw new Error(`Ticket ${ticketId} not found`);

    const existing = await this.prisma.aiAnalysis.findUnique({
      where: { ticketId },
    });
    if (existing) {
      this.logger.log(`Ticket ${ticketId} already analyzed, skipping`);
      return existing;
    }

    const aiResult = await this.callLlm(ticket.description);

    let latitude: number | null = null;
    let longitude: number | null = null;

    if (ticket.country || ticket.city || ticket.street) {
      const addressParts = [
        ticket.street,
        ticket.house,
        ticket.city,
        ticket.region,
        ticket.country,
      ]
        .filter(Boolean)
        .join(', ');

      const coords = await this.geocodingService.geocode(addressParts);
      if (coords) {
        latitude = coords.latitude;
        longitude = coords.longitude;
      }
    }

    const analysis = await this.prisma.aiAnalysis.create({
      data: {
        ticketId,
        type: aiResult.type,
        tonality: aiResult.tonality,
        priority: aiResult.priority,
        language: aiResult.language,
        summary: aiResult.summary,
        latitude,
        longitude,
      },
    });

    await this.prisma.ticket.update({
      where: { id: ticketId },
      data: { status: 'analyzed' },
    });

    this.logger.log(
      `Ticket ${ticketId} analyzed: type=${aiResult.type}, priority=${aiResult.priority}, lang=${aiResult.language}`,
    );
    return analysis;
  }

  async analyzeAllPending(): Promise<{ analyzed: number; errors: number }> {
    const pendingTickets = await this.prisma.ticket.findMany({
      where: {
        aiAnalysis: null,
      },
      select: { id: true },
    });

    this.logger.log(
      `Found ${pendingTickets.length} pending tickets for analysis`,
    );

    let analyzed = 0;
    let errors = 0;

    const concurrency = 5;
    for (let i = 0; i < pendingTickets.length; i += concurrency) {
      const batch = pendingTickets.slice(i, i + concurrency);
      const results = await Promise.allSettled(
        batch.map((t) => this.analyzeTicket(t.id)),
      );

      for (const result of results) {
        if (result.status === 'fulfilled') {
          analyzed++;
        } else {
          errors++;
          this.logger.error(`Analysis failed: ${result.reason}`);
        }
      }
    }

    return { analyzed, errors };
  }

  private async callLlm(description: string): Promise<AiResult> {
    const systemPrompt = `You are an AI assistant that analyzes customer service tickets. Analyze the following ticket and respond ONLY with valid JSON (no markdown, no code blocks) with these exact fields:

{
  "type": "<one of: Жалоба, Смена данных, Консультация, Претензия, Неработоспособность приложения, Мошеннические действия, Спам>",
  "tonality": "<one of: Позитивный, Нейтральный, Негативный>",
  "priority": <number from 1 to 10, where 10 is most urgent>,
  "language": "<detected language: KZ, ENG, or RU>",
  "summary": "<1-2 sentence summary of the ticket + recommendation for manager action>"
}

Rules:
- type MUST be exactly one of the listed categories
- tonality MUST be exactly one of: Позитивный, Нейтральный, Негативный
- priority MUST be a number between 1 and 10
- language: detect the language of the ticket text. If Kazakh → KZ, if English → ENG, if Russian or unclear → RU
- summary should be concise and actionable, written in Russian`;

    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: description },
        ],
        temperature: 0.1,
        max_tokens: 500,
      });

      const content = response.choices[0]?.message?.content?.trim() || '';
      const cleanedContent = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const result: AiResult = JSON.parse(cleanedContent);

      const validTypes = [
        'Жалоба',
        'Смена данных',
        'Консультация',
        'Претензия',
        'Неработоспособность приложения',
        'Мошеннические действия',
        'Спам',
      ];
      if (!validTypes.includes(result.type)) {
        result.type = 'Консультация';
      }

      const validTonalities = ['Позитивный', 'Нейтральный', 'Негативный'];
      if (!validTonalities.includes(result.tonality)) {
        result.tonality = 'Нейтральный';
      }

      if (
        typeof result.priority !== 'number' ||
        result.priority < 1 ||
        result.priority > 10
      ) {
        result.priority = 5;
      }

      const validLanguages = ['KZ', 'ENG', 'RU'];
      if (!validLanguages.includes(result.language)) {
        result.language = 'RU';
      }

      if (!result.summary || typeof result.summary !== 'string') {
        result.summary = 'Требуется ручной анализ обращения.';
      }

      return result;
    } catch (error) {
      this.logger.error(`LLM call failed: ${error}`);
      return {
        type: 'Консультация',
        tonality: 'Нейтральный',
        priority: 5,
        language: 'RU',
        summary: 'Автоматический анализ не удался. Требуется ручная проверка.',
      };
    }
  }
}
