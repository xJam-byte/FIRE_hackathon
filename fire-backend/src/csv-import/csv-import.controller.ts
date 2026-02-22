import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  HttpCode,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { CsvImportService } from './csv-import.service';
import * as path from 'path';

@ApiTags('import')
@Controller('import')
export class CsvImportController {
  constructor(private readonly csvImportService: CsvImportService) {}

  @Post()
  @ApiOperation({
    summary: 'Импорт данных из CSV файлов (tickets, managers, business units)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        tickets: {
          type: 'string',
          format: 'binary',
          description: 'CSV файл с обращениями',
        },
        managers: {
          type: 'string',
          format: 'binary',
          description: 'CSV файл с менеджерами',
        },
        businessUnits: {
          type: 'string',
          format: 'binary',
          description: 'CSV файл с офисами',
        },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'tickets', maxCount: 1 },
      { name: 'managers', maxCount: 1 },
      { name: 'businessUnits', maxCount: 1 },
    ]),
  )
  async importCsv(
    @UploadedFiles()
    files: {
      tickets?: Express.Multer.File[];
      managers?: Express.Multer.File[];
      businessUnits?: Express.Multer.File[];
    },
  ) {
    return this.csvImportService.importAll({
      tickets: files.tickets?.[0],
      managers: files.managers?.[0],
      businessUnits: files.businessUnits?.[0],
    });
  }

  @Post('seed')
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Импорт данных из CSV файлов, расположенных в корне проекта (auto-seed)',
    description:
      'Автоматически находит business_units.csv, managers.csv и tickets.csv в папке datasour и импортирует',
  })
  async seedFromFiles() {
    const rootDir = path.resolve(__dirname, '..', '..', '..');
    return this.csvImportService.importFromPaths({
      businessUnitsPath: path.join(rootDir, 'business_units.csv'),
      managersPath: path.join(rootDir, 'managers.csv'),
      ticketsPath: path.join(rootDir, 'tickets.csv'),
    });
  }
}
