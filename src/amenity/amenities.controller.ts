import { Controller, Post, Body, Get, Delete, Param } from '@nestjs/common';
import { AmenitiesService } from './amenities.service';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { Roles } from '../auth/decorators/role.decorator';
import { RolesEnum } from '../auth/role.enum';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UseGuards } from '@nestjs/common';

@Controller('amenities')
@UseGuards(JwtAuthGuard)
export class AmenitiesController {
  constructor(private readonly amenitiesService: AmenitiesService) {}

  @Post()
  @Roles(RolesEnum.ADMIN)
  create(@Body() dto: CreateAmenityDto) {
    return this.amenitiesService.create(dto);
  }

  @Get()
  findAll() {
    return this.amenitiesService.findAll();
  }

  @Delete(':id')
  @Roles(RolesEnum.ADMIN)
  remove(@Param('id') id: string) {
    return this.amenitiesService.delete(id);
  }
}
