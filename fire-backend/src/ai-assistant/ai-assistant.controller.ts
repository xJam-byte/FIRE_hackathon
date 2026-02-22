import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AiAssistantService } from './ai-assistant.service';

class AiQueryDto {
  question: string;
}

@ApiTags('assistant')
@Controller('assistant')
export class AiAssistantController {
  constructor(private readonly aiAssistantService: AiAssistantService) {}

  @Post('query')
  @ApiOperation({
    summary:
      'AI-ассистент: задайте вопрос на естественном языке для получения аналитики',
    description:
      'Например: "Покажи распределение типов обращений по городам", "Сколько VIP обращений?", "Какой менеджер наиболее загружен?"',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        question: {
          type: 'string',
          example: 'Покажи распределение типов обращений по городам',
        },
      },
      required: ['question'],
    },
  })
  query(@Body() body: AiQueryDto) {
    return this.aiAssistantService.query(body.question);
  }
}
