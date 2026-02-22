import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

@Injectable()
export class GeocodingService {
  private readonly logger = new Logger(GeocodingService.name);
  private readonly nominatimUrl: string;
  private lastRequestTime = 0;

  constructor(private readonly configService: ConfigService) {
    this.nominatimUrl = this.configService.get<string>(
      'NOMINATIM_URL',
      'https://nominatim.openstreetmap.org',
    );
  }

  async geocode(address: string): Promise<GeoCoordinates | null> {
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
        this.logger.warn(
          `Geocoding failed for "${address}": HTTP ${response.status}`,
        );
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
    } catch (error) {
      this.logger.error(`Geocoding error for "${address}": ${error}`);
      return null;
    }
  }

  async geocodeBusinessUnit(address: string): Promise<GeoCoordinates | null> {
    return this.geocode(address);
  }

  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    const minDelay = 1100;

    if (elapsed < minDelay) {
      await new Promise((resolve) => setTimeout(resolve, minDelay - elapsed));
    }

    this.lastRequestTime = Date.now();
  }
}
