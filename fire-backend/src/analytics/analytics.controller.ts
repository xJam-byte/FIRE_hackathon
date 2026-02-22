import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('stats')
  @ApiOperation({
    summary: 'Полная статистика: топ проблем, распределения, нагрузка',
    description:
      'Возвращает агрегированные данные по типам обращений, тональности, приоритетам, сегментам, нагрузке менеджеров и офисов',
  })
  getStats() {
    return this.analyticsService.getFullAnalytics();
  }

  @Get('report')
  @ApiOperation({
    summary: 'AI-отчёт с рекомендациями для администраторов',
    description:
      'Генерирует полный отчёт со статистикой + AI-рекомендации, риски и KPI',
  })
  getReport() {
    return this.analyticsService.getAiRecommendations();
  }
}
