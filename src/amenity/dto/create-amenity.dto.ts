import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateAmenityDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsUrl()
  icon?: string;
}
