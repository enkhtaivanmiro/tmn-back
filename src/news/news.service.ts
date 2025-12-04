// news.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News, NewsDocument } from '../schemas/news.schema';
import { PostNewsDto, NewsListQueryDto, UpdateNewsDto } from './dto/news.dto';
import { S3Service } from '../s3/s3.service'; // Assuming S3Service is in a sibling module

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private newsModel: Model<NewsDocument>,
    private readonly s3Service: S3Service, // Inject the S3 service
  ) {}

  // 1. CREATE News Article (Handles Base64 Upload)
  async postNews(postNewsDto: PostNewsDto): Promise<NewsDocument> {
    const dtoCopy: PostNewsDto = { ...postNewsDto };

    // CRITICAL: Handle embedded Base64 images in the Quill Delta content
    for (const lang of Object.keys(dtoCopy.description)) {
      const content = JSON.parse(dtoCopy.description[lang]);
      
      for (const op of content) {
        // Check for an image operation containing Base64 data: "data:image/..."
        if (typeof op.insert === 'object' && op.insert.image?.startsWith('data:')) {
          
          // 1. Extract Base64 data (e.g., remove "data:image/png;base64,")
          const base64Parts = op.insert.image.split(',');
          const base64Data = base64Parts.length > 1 ? base64Parts[1] : base64Parts[0];
          
          const buffer = Buffer.from(base64Data, 'base64');
          const originalName = 'uploaded-quill-image.png'; // Use a generic name
          
          // 2. Upload to S3
          const url = await this.s3Service.uploadFile(buffer, originalName, 'image/png');
          
          // 3. Replace Base64 string with the permanent S3 URL
          op.insert.image = url;
        }
      }
      
      // 4. Update the DTO with the clean, URL-containing, stringified Delta
      dtoCopy.description[lang] = JSON.stringify(content);
    }
    
    // Create the document using the newsModel
    const createdNews = new this.newsModel(dtoCopy);
    return createdNews.save();
  }

  // 2. GET All/List News Articles
  async getAllNews(query: NewsListQueryDto): Promise<any> {
    const { page = 1, limit = 20, search, published } = query;
    const skip = (page - 1) * limit;
    
    const filters: any = {};
    if (published !== undefined) {
        filters.published = published;
    }
    
    const listQuery = this.newsModel.find(filters);
    
    if (search) {
        // Use the text index defined in the schema for searching
        listQuery.find({ $text: { $search: search } });
    }
    
    const total = await this.newsModel.countDocuments(filters);
    const data = await listQuery
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();

    return { total, page, limit, data };
  }

  // 3. GET Published News Articles (A specialized version of getAllNews)
  async getPublishedNews(query: NewsListQueryDto): Promise<any> {
    return this.getAllNews({ ...query, published: true });
  }

  // 4. GET News Article by ID
  async findById(id: string): Promise<NewsDocument> {
    const news = await this.newsModel.findById(id).exec();
    if (!news) {
      throw new NotFoundException(`News article with ID "${id}" not found`);
    }
    return news;
  }
  
  // 5. GET News Article by Slug
  async findBySlug(slug: string): Promise<NewsDocument> {
    const news = await this.newsModel.findOne({ slug, published: true }).exec();
    if (!news) {
      throw new NotFoundException(`News article with slug "${slug}" not found`);
    }
    return news;
  }
  
  // 6. UPDATE News Article
  async updateById(id: string, updateNewsDto: UpdateNewsDto): Promise<NewsDocument> {
    const updatedNews = await this.newsModel
      .findByIdAndUpdate(id, updateNewsDto, { new: true }) // { new: true } returns the updated document
      .exec();

    if (!updatedNews) {
      throw new NotFoundException(`News article with ID "${id}" not found`);
    }
    return updatedNews;
  }
  
  // 7. DELETE News Article
  async deleteById(id: string): Promise<{ deleted: boolean; }> {
    const result = await this.newsModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
        throw new NotFoundException(`News article with ID "${id}" not found`);
    }
    return { deleted: true };
  }
  
  // 8. PUBLISH News Article
  async publishNews(id: string): Promise<NewsDocument> {
    const publishedNews = await this.newsModel
      .findByIdAndUpdate(id, { published: true }, { new: true })
      .exec();
    
    if (!publishedNews) {
      throw new NotFoundException(`News article with ID "${id}" not found`);
    }
    return publishedNews;
  }

  // 9. UNPUBLISH News Article
  async unpublishNews(id: string): Promise<NewsDocument> {
    const unpublishedNews = await this.newsModel
      .findByIdAndUpdate(id, { published: false }, { new: true })
      .exec();
      
    if (!unpublishedNews) {
      throw new NotFoundException(`News article with ID "${id}" not found`);
    }
    return unpublishedNews;
  }
}