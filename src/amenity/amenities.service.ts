import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Amenity } from './schemas/amenity.schema';
import { CreateAmenityDto } from './dto/create-amenity.dto';

@Injectable()
export class AmenitiesService {
  constructor(
    @InjectModel(Amenity.name) private amenityModel: Model<Amenity>,
  ) {}

  async create(dto: CreateAmenityDto) {
    return this.amenityModel.create(dto);
  }

  async findAll() {
    return this.amenityModel.find();
  }

  async delete(id: string) {
    return this.amenityModel.findByIdAndDelete(id);
  }
}
