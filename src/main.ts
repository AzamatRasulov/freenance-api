import { INestApplication, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)

  setupValidation(app)
  setupSwagger(app)

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
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document, {})
}

void bootstrap()
