import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateConstructionProjectDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  projectType?: string;

  @IsOptional()
  @IsNumber()
  budget?: number;

  @IsOptional()
  @IsArray()
  images?: string[];
}
