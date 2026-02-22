import { Module } from '@nestjs/common';
import { AiAnalysisService } from './ai-analysis.service';
import { GeocodingService } from './geocoding.service';

@Module({
  providers: [AiAnalysisService, GeocodingService],
  exports: [AiAnalysisService, GeocodingService],
})
export class AiAnalysisModule {}
