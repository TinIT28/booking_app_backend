// listings/dto/filter-listing.dto.ts
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class FilterListingDto {
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsNumber() minPrice?: number;
  @IsOptional() @IsNumber() maxPrice?: number;
}
