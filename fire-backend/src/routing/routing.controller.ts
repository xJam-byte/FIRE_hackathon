import { Controller, Post, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RoutingService } from './routing.service';

@ApiTags('routing')
@Controller('routing')
export class RoutingController {
  constructor(private readonly routingService: RoutingService) {}

  @Post('process')
  @ApiOperation({
    summary:
      'Запуск полного пайплайна обработки: AI-анализ → маршрутизация для всех необработанных тикетов',
  })
  processAll() {
    return this.routingService.processAllTickets();
  }

  @Get('assignments')
  @ApiOperation({ summary: 'Получить все назначения с фильтрами' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'businessUnitId', required: false, type: Number })
  @ApiQuery({ name: 'managerId', required: false, type: Number })
  getAssignments(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('businessUnitId') businessUnitId?: number,
    @Query('managerId') managerId?: number,
  ) {
    return this.routingService.getAssignments({
      page,
      limit,
      businessUnitId,
      managerId,
    });
  }
}
