import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BusinessUnitsService } from './business-units.service';

@ApiTags('business-units')
@Controller('business-units')
export class BusinessUnitsController {
  constructor(private readonly businessUnitsService: BusinessUnitsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все бизнес-единицы (офисы)' })
  findAll() {
    return this.businessUnitsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить офис с менеджерами' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.businessUnitsService.findOne(id);
  }
}
