import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(): Promise<{
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
    getByPriority(): Promise<{
        priority: number;
        count: number;
    }[]>;
    getTypeByCityDistribution(): Promise<any[]>;
}
