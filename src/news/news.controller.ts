import { Body, Controller, Get, Param, Post, Put, NotFoundException } from '@nestjs/common';
import { NewsService } from './news.service';
import { EditNewsDto, PostNewsDto } from './dto/news.dto';
import mongoose from 'mongoose';

@Controller('news')
export class NewsController {
    constructor(private newsService: NewsService) {}

    @Post()
    postNews(@Body() postNewsDto: PostNewsDto) {
        return this.newsService.postNews(postNewsDto);
    }

    @Get()
    getAllNews() {
        return this.newsService.getAllNews();
    }

    @Get(':id')
    async getNewsById(@Param('id') id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new NotFoundException('News not found');
        }

        return this.newsService.findById(id);
    }

    @Put(':id')
    async editNewsById(
        @Param('id') id: string,
        @Body() editNewsDto: EditNewsDto
    ) {
        const { title, description } = editNewsDto;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new NotFoundException('News ID is invalid');
        }

        return this.newsService.editById(id, title, description);
    }

}
