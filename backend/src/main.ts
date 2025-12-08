// System
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
// This path
import { AppModule } from './app.module';


async function bootstrap() {
  // Create app  
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Security: Helmet middleware (configures secure HTTP headers)
  app.use(helmet({
    contentSecurityPolicy: false, // CSP handled by nginx reverse proxy
    crossOriginEmbedderPolicy: false, // Allow Socket.IO embedding
    hsts: false, // HSTS handled by nginx reverse proxy
  }));

  // Enable cookie parser
  app.use(cookieParser(process.env.BACKEND_COOKIE_SECRET)); // It's redundant
  
  // CORS configuration
  //origin: [process.env.FRONTEND_HOST!], // Old cors config.
  app.enableCors({
    origin: (origin, callback) => {
      // Enable CORS to use cookies from frontend
      const allowedOrigins = [
        process.env.FRONTEND_HOST!,
        `https://${process.env.REVERSE_PROXY_DOMAIN_NAME}`, // Without port (standard 443)
        `${process.env.REVERSE_PROXY_LOCAL_HTTPS_HOST!}:${process.env.REVERSE_PROXY_HTTPS_PORT!}`, // Local network access
        `https://${process.env.REVERSE_PROXY_DOMAIN_NAME}:${process.env.REVERSE_PROXY_HTTPS_PORT}`, // With explicit port
        `http://${process.env.REVERSE_PROXY_DOMAIN_NAME}:${process.env.REVERSE_PROXY_HTTP_PORT}`, // HTTP (redirects to HTTPS)
      ];
      // Allow requests with no origin (mobile apps, Postman, curl)
      if (!origin) return callback(null, true);
      // Check if the origin is in the allowed list
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Block other origins
      logger.warn(`Allowed CORS origins: ${allowedOrigins.join(', ')}`);
      logger.warn(`Blocked CORS request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true, // Important for cookies!
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
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
  await app.listen(+process.env.BACKEND_PORT!, '0.0.0.0');
  // Log
  logger.log(`App running on port ${ +process.env.BACKEND_PORT! }`);
}
// Start the application
bootstrap();
