import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { NewsModule } from './news/news.module';
import { S3Service } from './s3/s3.service';
import { S3Module } from './s3/s3.module';
import { ConfigModule } from '@nestjs/config';
import { ContactService } from './contact/contact.service';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Loads .env file and makes variables global,
    MongooseModule.forRoot('mongodb://localhost:27017/tumen'),
    NewsModule,
    S3Module,
    ContactModule,
  ],
  providers: [S3Service, ContactService],
})
export class AppModule {
}
