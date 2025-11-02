import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News } from 'src/schemas/news.schema';
import { PostNewsDto } from './dto/news.dto';

@Injectable()
export class NewsService {
    constructor(
        @InjectModel(News.name) private newsModel: Model<News>
    ) {}

    postNews(postNewsDto: PostNewsDto) {
        const newPost = new this.newsModel(postNewsDto);
        return newPost.save();
    }

    getAllNews() {
        return this.newsModel.find();
    }

    findById(id: string) {
        return this.newsModel.findById(id);
    }
}
