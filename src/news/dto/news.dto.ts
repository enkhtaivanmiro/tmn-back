import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class PostNewsDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;
}

export class EditNewsDto {
    _id: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}