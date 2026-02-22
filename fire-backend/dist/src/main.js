"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('FIRE API')
        .setDescription('Freedom Intelligent Routing Engine — автоматическая обработка и распределение обращений клиентов')
        .setVersion('1.0')
        .addTag('import', 'Импорт CSV данных')
        .addTag('tickets', 'Обращения клиентов')
        .addTag('managers', 'Менеджеры')
        .addTag('business-units', 'Бизнес-единицы (офисы)')
        .addTag('routing', 'Маршрутизация обращений')
        .addTag('dashboard', 'Статистика и аналитика')
        .addTag('assistant', 'AI-ассистент')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🔥 FIRE API is running on http://localhost:${port}`);
    console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map