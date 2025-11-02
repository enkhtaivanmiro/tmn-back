import { IsNotEmpty, IsString } from "class-validator";

export class PostNewsDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;
}