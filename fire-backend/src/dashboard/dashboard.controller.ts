import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Общая статистика системы' })
  getStats() {
    return this.dashboardService.getOverallStats();
  }

  @Get('by-type')
  @ApiOperation({ summary: 'Распределение по типам обращений' })
  getByType() {
    return this.dashboardService.getByType();
  }

  @Get('by-tonality')
  @ApiOperation({ summary: 'Распределение по тональности' })
  getByTonality() {
    return this.dashboardService.getByTonality();
  }

  @Get('by-language')
  @ApiOperation({ summary: 'Распределение по языкам обращений' })
  getByLanguage() {
    return this.dashboardService.getByLanguage();
  }

  @Get('by-office')
  @ApiOperation({ summary: 'Распределение по офисам с нагрузкой' })
  getByOffice() {
    return this.dashboardService.getByOffice();
  }

  @Get('by-manager')
  @ApiOperation({ summary: 'Нагрузка по менеджерам' })
  getByManager() {
    return this.dashboardService.getByManager();
  }

  @Get('by-city')
  @ApiOperation({ summary: 'Распределение обращений по городам' })
  getByCity() {
    return this.dashboardService.getByCity();
  }

  @Get('by-segment')
  @ApiOperation({ summary: 'Распределение по сегментам клиентов' })
  getBySegment() {
    return this.dashboardService.getBySegment();
  }

  @Get('by-priority')
  @ApiOperation({ summary: 'Распределение по приоритетам' })
  getByPriority() {
    return this.dashboardService.getPriorityDistribution();
  }

  @Get('type-by-city')
  @ApiOperation({
    summary: 'Распределение типов обращений по городам (кросс-таблица)',
  })
  getTypeByCityDistribution() {
    return this.dashboardService.getTypeByCityDistribution();
  }
}
