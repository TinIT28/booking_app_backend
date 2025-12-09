// listings/listings.module.ts
import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Listing, ListingSchema } from './entities/listing.entity';
import { Amenity, AmenitySchema } from './entities/amenity.entity';
import {
  ListingImage,
  ListingImageSchema,
} from './entities/listing-image.entity';
import { Rating, RatingSchema } from './entities/rating.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Listing.name, schema: ListingSchema },
      { name: Amenity.name, schema: AmenitySchema },
      { name: ListingImage.name, schema: ListingImageSchema },
      { name: Rating.name, schema: RatingSchema },
    ]),
  ],
  controllers: [ListingsController],
  providers: [ListingsService],
})
export class ListingsModule {}
