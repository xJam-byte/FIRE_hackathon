import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getStats(): Promise<{
        overallStats: {
            totalTickets: number;
            analyzedTickets: number;
            assignedTickets: number;
            pendingTickets: number;
            totalManagers: number;
            totalBusinessUnits: number;
        };
        topProblems: {
            type: string;
            count: number;
            percentage: number;
        }[];
        tonalityBreakdown: {
            tonality: string;
            count: number;
            percentage: number;
        }[];
        priorityBreakdown: {
            priority: number;
            count: number;
        }[];
        segmentBreakdown: {
            segment: string;
            count: number;
            percentage: number;
        }[];
        languageBreakdown: {
            language: string;
            count: number;
        }[];
        cityBreakdown: {
            city: string;
            count: number;
        }[];
        managerLoad: {
            id: number;
            fullName: string;
            position: string;
            skills: string[];
            office: string;
            currentLoad: number;
            assignmentsCount: number;
        }[];
        officeLoad: {
            id: number;
            name: string;
            address: string;
            managersCount: number;
            assignmentsCount: number;
            totalLoad: number;
        }[];
        recentTrends: {
            avgPriority: number;
            negativePercentage: number;
            totalRecent: number;
        };
        highPriorityTickets: ({
            aiAnalysis: {
                latitude: number | null;
                longitude: number | null;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                summary: string;
                type: string;
                ticketId: number;
                tonality: string;
                priority: number;
                language: string;
            } | null;
            assignment: ({
                businessUnit: {
                    name: string;
                };
                manager: {
                    fullName: string;
                };
            } & {
                createdAt: Date;
                updatedAt: Date;
                id: number;
                businessUnitId: number;
                ticketId: number;
                managerId: number;
                reason: string | null;
                assignedAt: Date;
            }) | null;
        } & {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            clientGuid: string;
            gender: string | null;
            birthDate: Date | null;
            segment: string;
            description: string;
            attachments: string | null;
            country: string | null;
            region: string | null;
            city: string | null;
            street: string | null;
            house: string | null;
            status: string;
        })[];
    }>;
    getReport(): Promise<{
        aiReport: any;
        overallStats: {
            totalTickets: number;
            analyzedTickets: number;
            assignedTickets: number;
            pendingTickets: number;
            totalManagers: number;
            totalBusinessUnits: number;
        };
        topProblems: {
            type: string;
            count: number;
            percentage: number;
        }[];
        tonalityBreakdown: {
            tonality: string;
            count: number;
            percentage: number;
        }[];
        priorityBreakdown: {
            priority: number;
            count: number;
        }[];
        segmentBreakdown: {
            segment: string;
            count: number;
            percentage: number;
        }[];
        languageBreakdown: {
            language: string;
            count: number;
        }[];
        cityBreakdown: {
            city: string;
            count: number;
        }[];
        managerLoad: {
            id: number;
            fullName: string;
            position: string;
            skills: string[];
            office: string;
            currentLoad: number;
            assignmentsCount: number;
        }[];
        officeLoad: {
            id: number;
            name: string;
            address: string;
            managersCount: number;
            assignmentsCount: number;
            totalLoad: number;
        }[];
        recentTrends: {
            avgPriority: number;
            negativePercentage: number;
            totalRecent: number;
        };
        highPriorityTickets: ({
            aiAnalysis: {
                latitude: number | null;
                longitude: number | null;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                summary: string;
                type: string;
                ticketId: number;
                tonality: string;
                priority: number;
                language: string;
            } | null;
            assignment: ({
                businessUnit: {
                    name: string;
                };
                manager: {
                    fullName: string;
                };
            } & {
                createdAt: Date;
                updatedAt: Date;
                id: number;
                businessUnitId: number;
                ticketId: number;
                managerId: number;
                reason: string | null;
                assignedAt: Date;
            }) | null;
        } & {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            clientGuid: string;
            gender: string | null;
            birthDate: Date | null;
            segment: string;
            description: string;
            attachments: string | null;
            country: string | null;
            region: string | null;
            city: string | null;
            street: string | null;
            house: string | null;
            status: string;
        })[];
    }>;
}
