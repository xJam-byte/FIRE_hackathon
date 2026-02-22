import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getOverallStats(): Promise<{
        totalTickets: number;
        analyzedTickets: number;
        assignedTickets: number;
        pendingTickets: number;
        totalManagers: number;
        totalBusinessUnits: number;
    }>;
    getByType(): Promise<{
        type: string;
        count: number;
    }[]>;
    getByTonality(): Promise<{
        tonality: string;
        count: number;
    }[]>;
    getByLanguage(): Promise<{
        language: string;
        count: number;
    }[]>;
    getByOffice(): Promise<{
        id: number;
        name: string;
        address: string;
        managersCount: number;
        assignmentsCount: number;
        totalLoad: number;
    }[]>;
    getByManager(): Promise<{
        id: number;
        fullName: string;
        position: string;
        skills: string[];
        office: string;
        currentLoad: number;
        assignmentsCount: number;
    }[]>;
    getByCity(): Promise<{
        city: string;
        count: number;
    }[]>;
    getBySegment(): Promise<{
        segment: string;
        count: number;
    }[]>;
    getPriorityDistribution(): Promise<{
        priority: number;
        count: number;
    }[]>;
    getTypeByCityDistribution(): Promise<any[]>;
}
