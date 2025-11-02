import { Body, Controller, Get, HttpException, Param, Post } from '@nestjs/common';
import { NewsService } from './news.service';
import { PostNewsDto } from './dto/news.dto';
import mongoose from 'mongoose';

@Controller('news')
export class NewsController {
    constructor(private newsService: NewsService) {}

    @Post()
    postNews(@Body() postNewsDto: PostNewsDto) {
        console.log(postNewsDto);
        return this.newsService.postNews(postNewsDto)
    }

    @Get()
    getAllNews() {
        return this.newsService.getAllNews();
    }

    @Get(':id')
    async getNewsById(@Param('id') id: string) {
        const isValid = mongoose.Types.ObjectId.isValid(id);

        if(!isValid) throw new HttpException('News not found', 404)
        const findNews = await this.newsService.findById(id);

        if(!findNews) throw new HttpException('News Not Found', 404);
        return findNews;
    }
}
