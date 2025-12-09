// listings/entities/amenity.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Amenity {
  @Prop({ required: true })
  name: string;

  @Prop()
  icon: string;
}

export const AmenitySchema = SchemaFactory.createForClass(Amenity);
