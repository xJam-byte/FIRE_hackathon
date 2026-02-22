import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ManagersService } from './managers.service';

@ApiTags('managers')
@Controller('managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @Get()
  @ApiOperation({ summary: 'Получить всех менеджеров с пагинацией' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'businessUnitId', required: false, type: Number })
  @ApiQuery({ name: 'position', required: false, type: String })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('businessUnitId') businessUnitId?: number,
    @Query('position') position?: string,
  ) {
    return this.managersService.findAll({
      page,
      limit,
      businessUnitId,
      position,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить менеджера с назначениями' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.managersService.findOne(id);
  }
}
