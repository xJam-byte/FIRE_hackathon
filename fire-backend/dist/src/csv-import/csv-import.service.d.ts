import { PrismaService } from '../prisma/prisma.service';
export declare class CsvImportService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    importAll(files: {
        tickets?: Express.Multer.File;
        managers?: Express.Multer.File;
        businessUnits?: Express.Multer.File;
    }): Promise<{
        message: string;
        imported: {
            businessUnits: number;
            managers: number;
            tickets: number;
        };
    }>;
    importFromPaths(paths: {
        ticketsPath?: string;
        managersPath?: string;
        businessUnitsPath?: string;
    }): Promise<{
        message: string;
        imported: {
            businessUnits: number;
            managers: number;
            tickets: number;
        };
    }>;
    private getField;
    private parseCsv;
    private importBusinessUnits;
    private importManagers;
    private importTickets;
}
