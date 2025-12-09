import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsMongoId,
} from 'class-validator';

export class CreateListingDto {
  @IsString() title: string;
  @IsString() description: string;
  @IsNumber() price: number;
  @IsString() address: string;
  @IsString() city: string;
  @IsString() country: string;

  @IsString()
  @IsMongoId({ each: true })
  host: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  amenities?: string[]; // array of Amenity IDs

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  images?: string[]; // array of ListingImage IDs
}
