// System
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
// This path
import { AppModule } from './app.module';


async function bootstrap() {
  // Create app  
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Enable cookie parser
  app.use(cookieParser(process.env.COOKIE_SECRET)); // It's redundant
  // Enable CORS to use cookies from frontend
  app.enableCors({
    //origin: 'http://localhost:4200',
    origin: true, // Allow all origins in development - adjust for production!
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true, // Important for cookies!
  });
  // Set global prefix host/api
  app.setGlobalPrefix('api');
  // Set Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      //transform: true,
    })
  );
  // Set Swagger
  const config = new DocumentBuilder()
    .setTitle('Home Assistant RESTFul API')
    .setDescription('Home Assistant endpoints documentation')
    .setVersion('1.0')
    //.addTag('home-assistant')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  
  // Listen
  await app.listen(process.env.PORT!, '0.0.0.0');
  // Log
  logger.log(`App running on port ${ process.env.PORT }`);
}
// Start the application
bootstrap();
