import { CsvImportService } from './csv-import.service';
export declare class CsvImportController {
    private readonly csvImportService;
    constructor(csvImportService: CsvImportService);
    importCsv(files: {
        tickets?: Express.Multer.File[];
        managers?: Express.Multer.File[];
        businessUnits?: Express.Multer.File[];
    }): Promise<{
        message: string;
        imported: {
            businessUnits: number;
            managers: number;
            tickets: number;
        };
    }>;
    seedFromFiles(): Promise<{
        message: string;
        imported: {
            businessUnits: number;
            managers: number;
            tickets: number;
        };
    }>;
}
