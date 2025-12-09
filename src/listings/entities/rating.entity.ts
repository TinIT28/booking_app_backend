// listings/entities/rating.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Rating {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true,
  })
  listing: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop({ min: 1, max: 5, required: true })
  score: number;

  @Prop()
  comment: string;

  // Airbnb tách nhỏ:
  @Prop() cleanliness: number;
  @Prop() accuracy: number;
  @Prop() checkIn: number;
  @Prop() communication: number;
  @Prop() location: number;
  @Prop() value: number;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
