import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News, NewsDocument } from 'src/schemas/news.schema';
import { PostNewsDto } from './dto/news.dto';

@Injectable()
export class NewsService {
    constructor(
        @InjectModel(News.name) private newsModel: Model<NewsDocument>
    ) {}

    postNews(postNewsDto: PostNewsDto) {
        const newPost = new this.newsModel(postNewsDto);
        return newPost.save();
    }

    getAllNews() {
        return this.newsModel.find();
    }

    async findById(id: string): Promise<NewsDocument> {
        const news = await this.newsModel.findById(id).exec();
        if (!news) {
            throw new NotFoundException(`News with id ${id} not found`);
        }
        return news;
    }

    async editById(id: string, title: string, description: string): Promise<NewsDocument> {
        const news = await this.findById(id);

        news.title = title;
        news.description = description;

        return news.save();
    }
}
