import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { parse } from 'csv-parse/sync';

type CsvRecord = Record<string, string>;

@Injectable()
export class CsvImportService {
  private readonly logger = new Logger(CsvImportService.name);

  constructor(private readonly prisma: PrismaService) {}

  async importAll(files: {
    tickets?: Express.Multer.File;
    managers?: Express.Multer.File;
    businessUnits?: Express.Multer.File;
  }) {
    const results = {
      businessUnits: 0,
      managers: 0,
      tickets: 0,
    };

    if (files.businessUnits) {
      results.businessUnits = await this.importBusinessUnits(
        files.businessUnits,
      );
    }

    if (files.managers) {
      results.managers = await this.importManagers(files.managers);
    }

    if (files.tickets) {
      results.tickets = await this.importTickets(files.tickets);
    }

    return {
      message: 'Import completed successfully',
      imported: results,
    };
  }

  async importFromPaths(paths: {
    ticketsPath?: string;
    managersPath?: string;
    businessUnitsPath?: string;
  }) {
    const fs = await import('fs');
    const results = { businessUnits: 0, managers: 0, tickets: 0 };

    if (paths.businessUnitsPath && fs.existsSync(paths.businessUnitsPath)) {
      const buffer = fs.readFileSync(paths.businessUnitsPath);
      results.businessUnits = await this.importBusinessUnits({
        buffer,
      } as Express.Multer.File);
    }

    if (paths.managersPath && fs.existsSync(paths.managersPath)) {
      const buffer = fs.readFileSync(paths.managersPath);
      results.managers = await this.importManagers({
        buffer,
      } as Express.Multer.File);
    }

    if (paths.ticketsPath && fs.existsSync(paths.ticketsPath)) {
      const buffer = fs.readFileSync(paths.ticketsPath);
      results.tickets = await this.importTickets({
        buffer,
      } as Express.Multer.File);
    }

    return { message: 'Import from files completed', imported: results };
  }

  private getField(record: CsvRecord, ...keys: string[]): string {
    for (const key of keys) {
      const val = record[key];
      if (val !== undefined && val !== null) return val.trim();
    }
    for (const recordKey of Object.keys(record)) {
      const trimmedKey = recordKey.trim();
      for (const key of keys) {
        if (trimmedKey === key.trim()) {
          const val = record[recordKey];
          if (val !== undefined && val !== null) return val.trim();
        }
      }
    }
    return '';
  }

  private parseCsv(file: Express.Multer.File): CsvRecord[] {
    const content = file.buffer.toString('utf-8');
    return parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true,
      delimiter: ',',
      relax_quotes: true,
      relax_column_count: true,
    }) as CsvRecord[];
  }

  private async importBusinessUnits(
    file: Express.Multer.File,
  ): Promise<number> {
    const records = this.parseCsv(file);
    this.logger.log(`Parsing ${records.length} business units`);

    let count = 0;
    for (const record of records) {
      const name = this.getField(record, 'Офис', 'Office', 'name');
      const address = this.getField(record, 'Адрес', 'Address', 'address');

      if (!name) continue;

      await this.prisma.businessUnit.create({
        data: { name, address },
      });
      count++;
    }

    this.logger.log(`Imported ${count} business units`);
    return count;
  }

  private async importManagers(file: Express.Multer.File): Promise<number> {
    const records = this.parseCsv(file);
    this.logger.log(`Parsing ${records.length} managers`);

    let count = 0;
    for (const record of records) {
      const fullName = this.getField(record, 'ФИО', 'fullName', 'name');
      const position = this.getField(
        record,
        'Должность',
        'Position',
        'position',
      );
      const skillsRaw = this.getField(record, 'Навыки', 'Skills', 'skills');
      const officeName = this.getField(
        record,
        'Офис',
        'Бизнес-единица',
        'BusinessUnit',
        'office',
      );
      const currentLoadRaw = this.getField(
        record,
        'Количество обращений в работе',
        'Кол-во обращений в работе',
        'CurrentLoad',
        'currentLoad',
      );

      if (!fullName) continue;

      const skills = skillsRaw
        .split(/[,;|]/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);

      let businessUnit = await this.prisma.businessUnit.findFirst({
        where: { name: { contains: officeName, mode: 'insensitive' } },
      });

      if (!businessUnit) {
        businessUnit = await this.prisma.businessUnit.create({
          data: { name: officeName, address: '' },
        });
      }

      await this.prisma.manager.create({
        data: {
          fullName,
          position,
          skills,
          businessUnitId: businessUnit.id,
          currentLoad: parseInt(currentLoadRaw, 10) || 0,
        },
      });
      count++;
    }

    this.logger.log(`Imported ${count} managers`);
    return count;
  }

  private async importTickets(file: Express.Multer.File): Promise<number> {
    const records = this.parseCsv(file);
    this.logger.log(`Parsing ${records.length} tickets`);

    let count = 0;
    for (const record of records) {
      const clientGuid = this.getField(
        record,
        'GUID клиента',
        'GUID',
        'clientGuid',
        'guid',
      );
      const gender = this.getField(
        record,
        'Пол клиента',
        'Пол',
        'Gender',
        'gender',
      );
      const birthDateRaw = this.getField(
        record,
        'Дата рождения',
        'BirthDate',
        'birthDate',
      );
      const segment =
        this.getField(
          record,
          'Сегмент клиента',
          'Сегмент',
          'Segment',
          'segment',
        ) || 'Mass';
      const description = this.getField(
        record,
        'Описание',
        'Description',
        'description',
      );
      const attachments = this.getField(
        record,
        'Вложения',
        'Attachments',
        'attachments',
      );
      const country = this.getField(record, 'Страна', 'Country', 'country');
      const region = this.getField(record, 'Область', 'Region', 'region');
      const city = this.getField(
        record,
        'Населённый пункт',
        'Населенный пункт',
        'City',
        'city',
      );
      const street = this.getField(record, 'Улица', 'Street', 'street');
      const house = this.getField(record, 'Дом', 'House', 'house');

      if (!clientGuid && !description) continue;

      let birthDate: Date | null = null;
      if (birthDateRaw) {
        try {
          birthDate = new Date(birthDateRaw);
          if (isNaN(birthDate.getTime())) birthDate = null;
        } catch {
          birthDate = null;
        }
      }

      await this.prisma.ticket.create({
        data: {
          clientGuid,
          gender: gender || null,
          birthDate,
          segment,
          description,
          attachments: attachments || null,
          country: country || null,
          region: region || null,
          city: city || null,
          street: street || null,
          house: house || null,
          status: 'new',
        },
      });
      count++;
    }

    this.logger.log(`Imported ${count} tickets`);
    return count;
  }
}
