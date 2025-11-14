// System
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
// This path
import { AppModule } from './app.module';


async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.enableCors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  app.setGlobalPrefix('api');
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      //transform: true,
    })
  );
  
  await app.listen(process.env.PORT!);
  logger.log(`App running on port ${ process.env.PORT }`);
}
bootstrap();
