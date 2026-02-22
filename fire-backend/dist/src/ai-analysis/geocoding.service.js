"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GeocodingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeocodingService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let GeocodingService = GeocodingService_1 = class GeocodingService {
    configService;
    logger = new common_1.Logger(GeocodingService_1.name);
    nominatimUrl;
    lastRequestTime = 0;
    constructor(configService) {
        this.configService = configService;
        this.nominatimUrl = this.configService.get('NOMINATIM_URL', 'https://nominatim.openstreetmap.org');
    }
    async geocode(address) {
        if (!address || address.trim().length === 0) {
            return null;
        }
        await this.rateLimit();
        try {
            const params = new URLSearchParams({
                q: address,
                format: 'json',
                limit: '1',
                addressdetails: '0',
            });
            const url = `${this.nominatimUrl}/search?${params.toString()}`;
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'FIRE-Backend/1.0',
                    'Accept-Language': 'ru,en',
                },
            });
            if (!response.ok) {
                this.logger.warn(`Geocoding failed for "${address}": HTTP ${response.status}`);
                return null;
            }
            const data = await response.json();
            if (!data || data.length === 0) {
                this.logger.warn(`No geocoding results for "${address}"`);
                return null;
            }
            const result = data[0];
            const latitude = parseFloat(result.lat);
            const longitude = parseFloat(result.lon);
            if (isNaN(latitude) || isNaN(longitude)) {
                return null;
            }
            this.logger.log(`Geocoded "${address}" → [${latitude}, ${longitude}]`);
            return { latitude, longitude };
        }
        catch (error) {
            this.logger.error(`Geocoding error for "${address}": ${error}`);
            return null;
        }
    }
    async geocodeBusinessUnit(address) {
        return this.geocode(address);
    }
    async rateLimit() {
        const now = Date.now();
        const elapsed = now - this.lastRequestTime;
        const minDelay = 1100;
        if (elapsed < minDelay) {
            await new Promise((resolve) => setTimeout(resolve, minDelay - elapsed));
        }
        this.lastRequestTime = Date.now();
    }
};
exports.GeocodingService = GeocodingService;
exports.GeocodingService = GeocodingService = GeocodingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GeocodingService);
//# sourceMappingURL=geocoding.service.js.map