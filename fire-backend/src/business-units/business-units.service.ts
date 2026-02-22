import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BusinessUnitsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.businessUnit.findMany({
      include: {
        _count: { select: { managers: true, assignments: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.businessUnit.findUnique({
      where: { id },
      include: {
        managers: {
          orderBy: { currentLoad: 'asc' },
        },
        _count: { select: { assignments: true } },
      },
    });
  }
}
