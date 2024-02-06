import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  app.enableCors()

  setupValidation(app)
  setupSwagger(app)
  setupStaticFolder(app as NestExpressApplication)

  await app.listen(3000)
}

function setupValidation(app: INestApplication): void {
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
}

function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Freenance')
    .setDescription('Invoice generation API')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'jwt'
    )
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, document, {})
}

function setupStaticFolder(app: NestExpressApplication): void {
  app.useStaticAssets(join(__dirname, '..', 'uploads'))
}

void bootstrap()
