import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ListingDocument = HydratedDocument<Listing>;

@Schema({ timestamps: true })
export class Listing {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  host: Types.ObjectId;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  country: string;

  @Prop([{ type: Types.ObjectId, ref: 'Amenity' }])
  amenities: Types.ObjectId[];

  @Prop([{ type: Types.ObjectId, ref: 'ListingImage' }])
  images: Types.ObjectId[];

  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ default: 0 })
  totalReviews: number;
}

export const ListingSchema = SchemaFactory.createForClass(Listing);
