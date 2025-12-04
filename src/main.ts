require('dotenv').config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe())
  const config = new DocumentBuilder()
    .setTitle("Tumen-Ekh")
    .setDescription("Tumen-Ekh APIs")
    .setVersion('1.0')
    .addTag("Tumen-Ekh")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  app.use(bodyParser.json({ limit: '10mb' })); 
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
