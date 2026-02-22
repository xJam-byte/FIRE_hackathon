import { PrismaService } from '../prisma/prisma.service';
export declare class BusinessUnitsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        _count: {
            managers: number;
            assignments: number;
        };
    } & {
        name: string;
        address: string;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    })[]>;
    findOne(id: number): Promise<({
        managers: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            fullName: string;
            position: string;
            skills: string[];
            currentLoad: number;
            businessUnitId: number;
        }[];
        _count: {
            assignments: number;
        };
    } & {
        name: string;
        address: string;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }) | null>;
}
