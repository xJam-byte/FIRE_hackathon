import { Module } from '@nestjs/common';
import { RoutingService } from './routing.service';
import { RoutingController } from './routing.controller';
import { AiAnalysisModule } from '../ai-analysis/ai-analysis.module';

@Module({
  imports: [AiAnalysisModule],
  controllers: [RoutingController],
  providers: [RoutingService],
  exports: [RoutingService],
})
export class RoutingModule {}
