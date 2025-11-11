import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { News, NewsSchema } from 'src/schemas/news.schema';
import { NewsService } from './news.service';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: News.name,
      schema: NewsSchema,
    }])
  ],
  controllers: [NewsController],
  providers: [NewsService]
})
export class NewsModule {}
