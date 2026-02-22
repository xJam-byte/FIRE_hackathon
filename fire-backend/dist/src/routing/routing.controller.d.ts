import { RoutingService } from './routing.service';
export declare class RoutingController {
    private readonly routingService;
    constructor(routingService: RoutingService);
    processAll(): Promise<{
        total: number;
        analyzed: number;
        assigned: number;
        errors: number;
    }>;
    getAssignments(page?: number, limit?: number, businessUnitId?: number, managerId?: number): Promise<{
        data: ({
            businessUnit: {
                name: string;
                address: string;
                latitude: number | null;
                longitude: number | null;
                createdAt: Date;
                updatedAt: Date;
                id: number;
            };
            manager: {
                createdAt: Date;
                updatedAt: Date;
                id: number;
                fullName: string;
                position: string;
                skills: string[];
                currentLoad: number;
                businessUnitId: number;
            };
            ticket: {
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
