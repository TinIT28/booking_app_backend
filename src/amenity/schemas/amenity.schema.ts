import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AmenityDocument = HydratedDocument<Amenity>;

@Schema({ timestamps: true })
export class Amenity {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  icon?: string; // URL icon

  @Prop({ default: true })
  isActive: boolean;
}

export const AmenitySchema = SchemaFactory.createForClass(Amenity);
