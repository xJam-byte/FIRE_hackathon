import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiAnalysisService } from '../ai-analysis/ai-analysis.service';
import { GeocodingService } from '../ai-analysis/geocoding.service';
import * as geolib from 'geolib';

const ASTANA_NAMES = ['астана', 'astana', 'нур-султан', 'nur-sultan'];
const ALMATY_NAMES = ['алматы', 'almaty', 'алма-ата'];

@Injectable()
export class RoutingService {
  private readonly logger = new Logger(RoutingService.name);
  private roundRobinCounters = new Map<string, number>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiAnalysisService: AiAnalysisService,
    private readonly geocodingService: GeocodingService,
  ) {}

  async processAllTickets(): Promise<{
    total: number;
    analyzed: number;
    assigned: number;
    errors: number;
  }> {
    const unassignedTickets = await this.prisma.ticket.findMany({
      where: { assignment: null },
      include: { aiAnalysis: true },
    });

    this.logger.log(
      `Processing ${unassignedTickets.length} unassigned tickets`,
    );

    let analyzed = 0;
    let assigned = 0;
    let errors = 0;

    await this.geocodeBusinessUnits();

    for (const ticket of unassignedTickets) {
      try {
        let analysis = ticket.aiAnalysis;
        if (!analysis) {
          analysis = await this.aiAnalysisService.analyzeTicket(ticket.id);
          analyzed++;
        }

        await this.assignTicket(ticket.id, analysis);
        assigned++;
      } catch (error) {
        errors++;
        this.logger.error(`Failed to process ticket ${ticket.id}: ${error}`);
      }
    }

    this.logger.log(
      `Processing complete: analyzed=${analyzed}, assigned=${assigned}, errors=${errors}`,
    );
    return {
      total: unassignedTickets.length,
      analyzed,
      assigned,
      errors,
    };
  }

  private async geocodeBusinessUnits(): Promise<void> {
    const units = await this.prisma.businessUnit.findMany({
      where: {
        OR: [{ latitude: null }, { longitude: null }],
      },
    });

    for (const unit of units) {
      if (unit.address) {
        const coords = await this.geocodingService.geocode(unit.address);
        if (coords) {
          await this.prisma.businessUnit.update({
            where: { id: unit.id },
            data: { latitude: coords.latitude, longitude: coords.longitude },
          });
          this.logger.log(
            `Geocoded business unit "${unit.name}" → [${coords.latitude}, ${coords.longitude}]`,
          );
        }
      }
    }
  }

  private async assignTicket(ticketId: number, analysis: any): Promise<void> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
    });
    if (!ticket) throw new Error(`Ticket ${ticketId} not found`);

    const allUnits = await this.prisma.businessUnit.findMany({
      include: { managers: true },
    });

    const targetUnit = this.findTargetBusinessUnit(analysis, allUnits);
    if (!targetUnit) {
      throw new Error(`No suitable business unit found for ticket ${ticketId}`);
    }

    let candidateManagers = targetUnit.managers;

    candidateManagers = this.filterByCompetencies(
      candidateManagers,
      ticket.segment,
      analysis.type,
      analysis.language,
    );

    if (candidateManagers.length === 0) {
      for (const unit of allUnits) {
        if (unit.id === targetUnit.id) continue;
        const fallbackCandidates = this.filterByCompetencies(
          unit.managers,
          ticket.segment,
          analysis.type,
          analysis.language,
        );
        if (fallbackCandidates.length > 0) {
          candidateManagers = fallbackCandidates;
          this.logger.warn(
            `Fallback: using managers from "${unit.name}" for ticket ${ticketId}`,
          );
          break;
        }
      }
    }

    if (candidateManagers.length === 0) {
      throw new Error(
        `No suitable manager found for ticket ${ticketId} (segment=${ticket.segment}, type=${analysis.type}, lang=${analysis.language})`,
      );
    }

    candidateManagers.sort((a: any, b: any) => a.currentLoad - b.currentLoad);
    const topTwo = candidateManagers.slice(0, 2);

    const selectedManager = this.roundRobinSelect(topTwo, targetUnit.id);

    const reasons: string[] = [];
    reasons.push(`Офис: ${targetUnit.name}`);
    if (['VIP', 'Priority'].includes(ticket.segment))
      reasons.push(`Сегмент ${ticket.segment} → навык VIP`);
    if (analysis.type === 'Смена данных')
      reasons.push('Тип "Смена данных" → Глав спец');
    if (['KZ', 'ENG'].includes(analysis.language))
      reasons.push(`Язык ${analysis.language} → навык ${analysis.language}`);
    reasons.push(`Нагрузка менеджера: ${selectedManager.currentLoad}`);

    await this.prisma.$transaction([
      this.prisma.assignment.create({
        data: {
          ticketId,
          managerId: selectedManager.id,
          businessUnitId: targetUnit.id,
          reason: reasons.join('; '),
        },
      }),
      this.prisma.manager.update({
        where: { id: selectedManager.id },
        data: { currentLoad: { increment: 1 } },
      }),
      this.prisma.ticket.update({
        where: { id: ticketId },
        data: { status: 'assigned' },
      }),
    ]);

    this.logger.log(
      `Ticket ${ticketId} assigned to ${selectedManager.fullName} (${targetUnit.name})`,
    );
  }

  private findTargetBusinessUnit(analysis: any, allUnits: any[]): any {
    if (!analysis.latitude || !analysis.longitude) {
      return this.splitAstanaAlmaty(allUnits);
    }

    const isKazakhstanCoords =
      analysis.latitude >= 40 &&
      analysis.latitude <= 56 &&
      analysis.longitude >= 46 &&
      analysis.longitude <= 88;

    if (!isKazakhstanCoords) {
      return this.splitAstanaAlmaty(allUnits);
    }

    const unitsWithCoords = allUnits.filter(
      (u) => u.latitude != null && u.longitude != null,
    );

    if (unitsWithCoords.length === 0) {
      return this.splitAstanaAlmaty(allUnits);
    }

    let nearestUnit = unitsWithCoords[0];
    let minDistance = Infinity;

    for (const unit of unitsWithCoords) {
      const distance = geolib.getDistance(
        { latitude: analysis.latitude, longitude: analysis.longitude },
        { latitude: unit.latitude!, longitude: unit.longitude! },
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestUnit = unit;
      }
    }

    return nearestUnit;
  }

  private splitAstanaAlmaty(allUnits: any[]): any {
    const astanaUnit = allUnits.find((u) =>
      ASTANA_NAMES.some((name) => u.name.toLowerCase().includes(name)),
    );
    const almatyUnit = allUnits.find((u) =>
      ALMATY_NAMES.some((name) => u.name.toLowerCase().includes(name)),
    );

    if (astanaUnit && almatyUnit) {
      const key = 'astana-almaty-split';
      const counter = this.roundRobinCounters.get(key) || 0;
      this.roundRobinCounters.set(key, counter + 1);
      return counter % 2 === 0 ? astanaUnit : almatyUnit;
    }

    return astanaUnit || almatyUnit || allUnits[0];
  }

  private filterByCompetencies(
    managers: any[],
    segment: string,
    ticketType: string,
    language: string,
  ): any[] {
    let filtered = [...managers];

    if (segment === 'VIP' || segment === 'Priority') {
      filtered = filtered.filter((m) =>
        m.skills.some((s: string) => s.toUpperCase() === 'VIP'),
      );
    }

    if (ticketType === 'Смена данных') {
      filtered = filtered.filter(
        (m) =>
          m.position.toLowerCase().includes('глав') ||
          m.position.toLowerCase().includes('главный') ||
          m.position.toLowerCase() === 'глав спец',
      );
    }

    if (language === 'KZ') {
      filtered = filtered.filter((m) =>
        m.skills.some((s: string) => s.toUpperCase() === 'KZ'),
      );
    } else if (language === 'ENG') {
      filtered = filtered.filter((m) =>
        m.skills.some((s: string) => s.toUpperCase() === 'ENG'),
      );
    }

    return filtered;
  }

  private roundRobinSelect(managers: any[], unitId: number): any {
    if (managers.length === 1) return managers[0];

    const key = `unit-${unitId}-${managers
      .map((m) => m.id)
      .sort()
      .join('-')}`;
    const counter = this.roundRobinCounters.get(key) || 0;
    const selected = managers[counter % managers.length];
    this.roundRobinCounters.set(key, counter + 1);
    return selected;
  }

  async getAssignments(query: {
    page?: number;
    limit?: number;
    businessUnitId?: number;
    managerId?: number;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.businessUnitId) where.businessUnitId = query.businessUnitId;
    if (query.managerId) where.managerId = query.managerId;

    const [data, total] = await Promise.all([
      this.prisma.assignment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { assignedAt: 'desc' },
        include: {
          ticket: {
            include: { aiAnalysis: true },
          },
          manager: true,
          businessUnit: true,
        },
      }),
      this.prisma.assignment.count({ where }),
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
}
