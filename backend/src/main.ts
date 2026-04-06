import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// Global Options for ValidationPipe
const globalOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
};

// Bootstrap function to start the NestJS application
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with specific options
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  });
  app.useGlobalPipes(new ValidationPipe(globalOptions));

  // Start the application on the specified port to 3000
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
