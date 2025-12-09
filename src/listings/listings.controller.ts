// listings/listings.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { Roles } from '../auth/decorators/role.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { RolesEnum } from '../auth/role.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  // Guest & Host đều xem được
  @Get()
  findAll(@Query() query: any) {
    return this.listingsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  // Host tạo listing
  @Post()
  @Roles(RolesEnum.HOST)
  @UseGuards(RolesGuard)
  create(@CurrentUser('id') hostId: string, @Body() dto: CreateListingDto) {
    return this.listingsService.create(hostId, dto);
  }

  // Host chỉnh sửa
  @Patch(':id')
  @Roles(RolesEnum.HOST)
  @UseGuards(RolesGuard)
  update(
    @Param('id') id: string,
    @CurrentUser('id') hostId: string,
    @Body() dto: UpdateListingDto,
  ) {
    return this.listingsService.update(id, hostId, dto);
  }

  // Host xoá listing
  @Delete(':id')
  @Roles(RolesEnum.HOST)
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string, @CurrentUser('id') hostId: string) {
    return this.listingsService.remove(id, hostId);
  }

  // Guest để lại rating
  @Post('rating')
  @Roles(RolesEnum.GUEST)
  @UseGuards(RolesGuard)
  rate(@CurrentUser('id') userId: string, @Body() dto: any) {
    return this.listingsService.addRating(userId, dto);
  }

  // Admin toàn quyền
  @Delete('admin/:id')
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  adminDelete(@Param('id') id: string) {
    return this.listingsService.remove(id, '');
  }
}
