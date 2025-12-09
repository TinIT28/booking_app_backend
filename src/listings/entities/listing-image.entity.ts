// listings/entities/listing-image.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class ListingImage {
  @Prop({ required: true })
  url: string;

  @Prop()
  caption: string;
}

export const ListingImageSchema = SchemaFactory.createForClass(ListingImage);
