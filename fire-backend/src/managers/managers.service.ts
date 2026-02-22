import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ManagersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    businessUnitId?: number;
    position?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.businessUnitId) where.businessUnitId = query.businessUnitId;
    if (query.position) where.position = query.position;

    const [data, total] = await Promise.all([
      this.prisma.manager.findMany({
        where,
        skip,
        take: limit,
        orderBy: { currentLoad: 'asc' },
        include: {
          businessUnit: true,
          _count: { select: { assignments: true } },
        },
      }),
      this.prisma.manager.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    return this.prisma.manager.findUnique({
      where: { id },
      include: {
        businessUnit: true,
        assignments: {
          include: {
            ticket: {
              include: { aiAnalysis: true },
            },
          },
          orderBy: { assignedAt: 'desc' },
          take: 50,
        },
      },
    });
  }
}
