import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { News, NewsSchema } from '../schemas/news.schema';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { S3Module } from '../s3/s3.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
    S3Module,
  ],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule {}