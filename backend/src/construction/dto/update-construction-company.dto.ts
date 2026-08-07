import { IsOptional, IsString, IsNumber, IsBoolean, IsArray } from 'class-validator';

export class UpdateConstructionCompanyDto {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsString()
	slug?: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsString()
	district?: string;

	@IsOptional()
	@IsNumber()
	yearsOfExperience?: number;

	@IsOptional()
	@IsNumber()
	startingBudget?: number;

	@IsOptional()
	@IsBoolean()
	verified?: boolean;

	@IsOptional()
	@IsArray()
	specializations?: string[];
}
