import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverallStats() {
    const [
      totalTickets,
      analyzedTickets,
      assignedTickets,
      totalManagers,
      totalBusinessUnits,
    ] = await Promise.all([
      this.prisma.ticket.count(),
      this.prisma.aiAnalysis.count(),
      this.prisma.assignment.count(),
      this.prisma.manager.count(),
      this.prisma.businessUnit.count(),
    ]);

    return {
      totalTickets,
      analyzedTickets,
      assignedTickets,
      pendingTickets: totalTickets - assignedTickets,
      totalManagers,
      totalBusinessUnits,
    };
  }

  async getByType() {
    const results = await this.prisma.aiAnalysis.groupBy({
      by: ['type'],
      _count: true,
      orderBy: { _count: { type: 'desc' } },
    });

    return results.map((r) => ({
      type: r.type,
      count: r._count,
    }));
  }

  async getByTonality() {
    const results = await this.prisma.aiAnalysis.groupBy({
      by: ['tonality'],
      _count: true,
      orderBy: { _count: { tonality: 'desc' } },
    });

    return results.map((r) => ({
      tonality: r.tonality,
      count: r._count,
    }));
  }

  async getByLanguage() {
    const results = await this.prisma.aiAnalysis.groupBy({
      by: ['language'],
      _count: true,
      orderBy: { _count: { language: 'desc' } },
    });

    return results.map((r) => ({
      language: r.language,
      count: r._count,
    }));
  }

  async getByOffice() {
    const units = await this.prisma.businessUnit.findMany({
      include: {
        _count: {
          select: {
            managers: true,
            assignments: true,
          },
        },
        managers: {
          select: { currentLoad: true },
        },
      },
    });

    return units.map((u) => ({
      id: u.id,
      name: u.name,
      address: u.address,
      managersCount: u._count.managers,
      assignmentsCount: u._count.assignments,
      totalLoad: u.managers.reduce((sum, m) => sum + m.currentLoad, 0),
    }));
  }

  async getByManager() {
    const managers = await this.prisma.manager.findMany({
      include: {
        businessUnit: { select: { name: true } },
        _count: { select: { assignments: true } },
      },
      orderBy: { currentLoad: 'desc' },
    });

    return managers.map((m) => ({
      id: m.id,
      fullName: m.fullName,
      position: m.position,
      skills: m.skills,
      office: m.businessUnit.name,
      currentLoad: m.currentLoad,
      assignmentsCount: m._count.assignments,
    }));
  }

  async getByCity() {
    const tickets = await this.prisma.ticket.findMany({
      where: { city: { not: null } },
      select: { city: true },
    });

    const cityMap = new Map<string, number>();
    for (const t of tickets) {
      if (t.city) {
        const city = t.city.trim();
        cityMap.set(city, (cityMap.get(city) || 0) + 1);
      }
    }

    return Array.from(cityMap.entries())
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count);
  }

  async getBySegment() {
    const results = await this.prisma.ticket.groupBy({
      by: ['segment'],
      _count: true,
      orderBy: { _count: { segment: 'desc' } },
    });

    return results.map((r) => ({
      segment: r.segment,
      count: r._count,
    }));
  }

  async getPriorityDistribution() {
    const results = await this.prisma.aiAnalysis.groupBy({
      by: ['priority'],
      _count: true,
      orderBy: { priority: 'asc' },
    });

    return results.map((r) => ({
      priority: r.priority,
      count: r._count,
    }));
  }

  async getTypeByCityDistribution() {
    const data = await this.prisma.ticket.findMany({
      where: {
        aiAnalysis: { isNot: null },
        city: { not: null },
      },
      select: {
        city: true,
        aiAnalysis: { select: { type: true } },
      },
    });

    const distribution = new Map<string, Map<string, number>>();
    for (const item of data) {
      const city = item.city?.trim() || 'Неизвестно';
      const type = item.aiAnalysis?.type || 'Неизвестно';

      if (!distribution.has(city)) {
        distribution.set(city, new Map());
      }
      const cityMap = distribution.get(city)!;
      cityMap.set(type, (cityMap.get(type) || 0) + 1);
    }

    const result: any[] = [];
    for (const [city, types] of distribution.entries()) {
      const typesObj: any = {};
      for (const [type, count] of types.entries()) {
        typesObj[type] = count;
      }
      result.push({ city, ...typesObj });
    }

    return result;
  }
}
