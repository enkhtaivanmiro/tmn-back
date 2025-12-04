import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsObject, IsArray, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PostNewsDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsObject()
    @IsNotEmpty()
    description: Record<string, string>;

    @IsString()
    @IsOptional()
    coverImage?: string;

    @IsBoolean()
    @IsOptional()
    published?: boolean;

    @IsString()
    @IsOptional()
    author?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];
}

export class UpdateNewsDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsObject()
    @IsOptional()
    description?: Record<string, string>;

    @IsString()
    @IsOptional()
    coverImage?: string;

    @IsBoolean()
    @IsOptional()
    published?: boolean;

    @IsString()
    @IsOptional()
    author?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];
}

export class NewsListQueryDto {
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @IsOptional()
    page?: number;

    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @IsOptional()
    limit?: number;

    @IsString()
    @IsOptional()
    search?: string;

    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    published?: boolean;
}