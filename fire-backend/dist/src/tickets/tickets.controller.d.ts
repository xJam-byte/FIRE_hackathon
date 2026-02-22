import { TicketsService } from './tickets.service';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    findAll(page?: number, limit?: number, status?: string, segment?: string): Promise<{
        data: ({
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
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<({
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
                address: string;
                latitude: number | null;
                longitude: number | null;
                createdAt: Date;
                updatedAt: Date;
                id: number;
            };
            manager: {
                businessUnit: {
                    name: string;
                    address: string;
                    latitude: number | null;
                    longitude: number | null;
                    createdAt: Date;
                    updatedAt: Date;
                    id: number;
                };
            } & {
                createdAt: Date;
                updatedAt: Date;
                id: number;
                fullName: string;
                position: string;
                skills: string[];
                currentLoad: number;
                businessUnitId: number;
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
    }) | null>;
    update(id: number, body: {
        status?: string;
    }): Promise<{
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
    }>;
}
