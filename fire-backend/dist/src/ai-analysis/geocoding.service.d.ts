import { ConfigService } from '@nestjs/config';
interface GeoCoordinates {
    latitude: number;
    longitude: number;
}
export declare class GeocodingService {
    private readonly configService;
    private readonly logger;
    private readonly nominatimUrl;
    private lastRequestTime;
    constructor(configService: ConfigService);
    geocode(address: string): Promise<GeoCoordinates | null>;
    geocodeBusinessUnit(address: string): Promise<GeoCoordinates | null>;
    private rateLimit;
}
export {};
