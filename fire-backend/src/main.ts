import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('FIRE API')
    .setDescription(
      'Freedom Intelligent Routing Engine — автоматическая обработка и распределение обращений клиентов',
    )
    .setVersion('1.0')
    .addTag('import', 'Импорт CSV данных')
    .addTag('tickets', 'Обращения клиентов')
    .addTag('managers', 'Менеджеры')
    .addTag('business-units', 'Бизнес-единицы (офисы)')
    .addTag('routing', 'Маршрутизация обращений')
    .addTag('dashboard', 'Статистика и аналитика')
    .addTag('assistant', 'AI-ассистент')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🔥 FIRE API is running on http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}
bootstrap();
