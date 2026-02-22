import { BusinessUnitsService } from './business-units.service';
export declare class BusinessUnitsController {
    private readonly businessUnitsService;
    constructor(businessUnitsService: BusinessUnitsService);
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
