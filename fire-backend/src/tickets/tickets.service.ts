import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    status?: string;
    segment?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.segment) where.segment = query.segment;

    const [data, total] = await Promise.all([
      this.prisma.ticket.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          aiAnalysis: true,
          assignment: {
            include: {
              manager: true,
              businessUnit: true,
            },
          },
        },
      }),
      this.prisma.ticket.count({ where }),
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
    return this.prisma.ticket.findUnique({
      where: { id },
      include: {
        aiAnalysis: true,
        assignment: {
          include: {
            manager: {
              include: { businessUnit: true },
            },
            businessUnit: true,
          },
        },
      },
    });
  }

  async update(id: number, data: { status?: string }) {
    return this.prisma.ticket.update({
      where: { id },
      data,
      include: {
        aiAnalysis: true,
        assignment: {
          include: {
            manager: true,
            businessUnit: true,
          },
        },
      },
    });
  }

  async getStats() {
    const [total, byStatus, bySegment] = await Promise.all([
      this.prisma.ticket.count(),
      this.prisma.ticket.groupBy({ by: ['status'], _count: true }),
      this.prisma.ticket.groupBy({ by: ['segment'], _count: true }),
    ]);

    return { total, byStatus, bySegment };
  }
}
