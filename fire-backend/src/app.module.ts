import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CsvImportModule } from './csv-import/csv-import.module';
import { TicketsModule } from './tickets/tickets.module';
import { ManagersModule } from './managers/managers.module';
import { BusinessUnitsModule } from './business-units/business-units.module';
import { AiAnalysisModule } from './ai-analysis/ai-analysis.module';
import { RoutingModule } from './routing/routing.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AiAssistantModule } from './ai-assistant/ai-assistant.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    CsvImportModule,
    TicketsModule,
    ManagersModule,
    BusinessUnitsModule,
    AiAnalysisModule,
    RoutingModule,
    DashboardModule,
    AiAssistantModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
