import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsService } from './news/news.service';
import { NewsModule } from './news/news.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:52848/?directConnection=true'), NewsModule],
  controllers: [AppController],
  providers: [AppService, NewsService],
})
export class AppModule {}
