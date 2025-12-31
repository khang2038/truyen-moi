import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateChapterDto {
  @IsString()
  title: string;

  @IsInt()
  index: number;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsArray()
  @IsString({ each: true })
  pages: string[];
}
