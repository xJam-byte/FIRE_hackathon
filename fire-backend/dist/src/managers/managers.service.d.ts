import { PrismaService } from '../prisma/prisma.service';
export declare class ManagersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: {
        page?: number;
        limit?: number;
        businessUnitId?: number;
        position?: string;
    }): Promise<{
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
            _count: {
                assignments: number;
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<({
        businessUnit: {
            name: string;
            address: string;
            latitude: number | null;
            longitude: number | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        };
        assignments: ({
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
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        fullName: string;
        position: string;
        skills: string[];
        currentLoad: number;
        businessUnitId: number;
    }) | null>;
}
