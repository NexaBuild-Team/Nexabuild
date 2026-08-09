import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreateConstructionReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
