import { 
    Controller, 
    Get, 
    Post, 
    Put, 
    Delete, 
    Body, 
    Param, 
    ValidationPipe,
    HttpCode,
    HttpStatus 
} from '@nestjs/common';
import { 
    ApiTags, 
    ApiOperation, 
    ApiResponse, 
    ApiParam, 
    ApiBody 
} from '@nestjs/swagger';
import { NewsService } from './news.service';
import { PostNewsDto, UpdateNewsDto, NewsListQueryDto } from './dto/news.dto';

@ApiTags('News')
@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new news article' })
    @ApiResponse({ status: 201, description: 'News article created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiBody({
        type: PostNewsDto,
        examples: {
            example1: {
                summary: 'Simple news article',
                value: {
                    title: 'Breaking News: New Technology Released',
                    description: {
                        en: 'This is an exciting announcement about our new technology.',
                        mn: 'Энэ бол манай шинэ технологийн талаархи сонирхолтой мэдээлэл юм.'
                    },
                    coverImage: 'https://example.com/images/news-cover.jpg',
                    published: false,
                    author: 'John Doe',
                    tags: ['technology', 'innovation', 'news']
                }
            }
        }
    })
    create(@Body(ValidationPipe) postNewsDto: PostNewsDto) {
        return this.newsService.postNews(postNewsDto);
    }

    @Post('list')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get paginated list of news articles' })
    @ApiResponse({ status: 200, description: 'Returns paginated news list' })
    @ApiBody({
        type: NewsListQueryDto,
        examples: {
            example1: {
                summary: 'Get first page',
                value: {
                    page: 1,
                    limit: 20
                }
            },
            example2: {
                summary: 'Search with filters',
                value: {
                    page: 1,
                    limit: 10,
                    search: 'technology',
                    published: true
                }
            },
            example3: {
                summary: 'Get unpublished drafts',
                value: {
                    page: 1,
                    limit: 20,
                    published: false
                }
            }
        }
    })
    getAll(@Body(ValidationPipe) queryDto: NewsListQueryDto) {
        return this.newsService.getAllNews(queryDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get news article by ID' })
    @ApiParam({ name: 'id', description: 'News article MongoDB ObjectId' })
    @ApiResponse({ status: 200, description: 'Returns news article' })
    @ApiResponse({ status: 404, description: 'News article not found' })
    findOne(@Param('id') id: string) {
        return this.newsService.findById(id);
    }

    @Get('slug/:slug')
    @ApiOperation({ summary: 'Get news article by slug' })
    @ApiParam({ name: 'slug', description: 'News article slug', example: 'breaking-news-new-technology' })
    @ApiResponse({ status: 200, description: 'Returns news article' })
    @ApiResponse({ status: 404, description: 'News article not found' })
    findBySlug(@Param('slug') slug: string) {
        return this.newsService.findBySlug(slug);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update news article' })
    @ApiParam({ name: 'id', description: 'News article MongoDB ObjectId' })
    @ApiResponse({ status: 200, description: 'News article updated successfully' })
    @ApiResponse({ status: 404, description: 'News article not found' })
    @ApiBody({
        type: UpdateNewsDto,
        examples: {
            example1: {
                summary: 'Update title and description',
                value: {
                    title: 'Updated Breaking News Title',
                    description: {
                        en: 'Updated content in English',
                        mn: 'Шинэчлэгдсэн агуулга монгол хэл дээр'
                    }
                }
            },
            example2: {
                summary: 'Update cover image only',
                value: {
                    coverImage: 'https://example.com/images/new-cover.jpg'
                }
            },
            example3: {
                summary: 'Update tags',
                value: {
                    tags: ['updated', 'technology', 'featured']
                }
            }
        }
    })
    update(
        @Param('id') id: string,
        @Body(ValidationPipe) updateNewsDto: UpdateNewsDto
    ) {
        return this.newsService.updateById(id, updateNewsDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete news article' })
    @ApiParam({ name: 'id', description: 'News article MongoDB ObjectId' })
    @ApiResponse({ status: 200, description: 'News article deleted successfully' })
    @ApiResponse({ status: 404, description: 'News article not found' })
    delete(@Param('id') id: string) {
        return this.newsService.deleteById(id);
    }

    @Post(':id/publish')
    @ApiOperation({ summary: 'Publish a news article' })
    @ApiParam({ name: 'id', description: 'News article MongoDB ObjectId' })
    @ApiResponse({ status: 200, description: 'News article published successfully' })
    @ApiResponse({ status: 404, description: 'News article not found' })
    publish(@Param('id') id: string) {
        return this.newsService.publishNews(id);
    }

    @Post(':id/unpublish')
    @ApiOperation({ summary: 'Unpublish a news article' })
    @ApiParam({ name: 'id', description: 'News article MongoDB ObjectId' })
    @ApiResponse({ status: 200, description: 'News article unpublished successfully' })
    @ApiResponse({ status: 404, description: 'News article not found' })
    unpublish(@Param('id') id: string) {
        return this.newsService.unpublishNews(id);
    }

    @Post('published/list')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get paginated list of published news articles' })
    @ApiResponse({ status: 200, description: 'Returns paginated published news list' })
    @ApiBody({
        type: NewsListQueryDto,
        examples: {
            example1: {
                summary: 'Get published news',
                value: {
                    page: 1,
                    limit: 20
                }
            },
            example2: {
                summary: 'Search published news',
                value: {
                    page: 1,
                    limit: 10,
                    search: 'technology'
                }
            }
        }
    })
    getPublished(@Body(ValidationPipe) queryDto: NewsListQueryDto) {
        return this.newsService.getPublishedNews(queryDto);
    }
}