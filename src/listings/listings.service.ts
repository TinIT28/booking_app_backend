import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Listing } from './entities/listing.entity';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { Rating } from './entities/rating.entity';

@Injectable()
export class ListingsService {
  constructor(
    @InjectModel(Listing.name) private listingModel: Model<Listing>,
    @InjectModel(Rating.name) private ratingModel: Model<Rating>,
  ) {}

  // ======================
  // 🔒 Helper: Check quyền host
  // ======================
  private ensureHostPermission(listing: Listing, hostId: string) {
    if (!listing) throw new NotFoundException('Listing not found');

    if (listing.host.toString() !== hostId) {
      throw new ForbiddenException(
        'You do not have permission for this listing',
      );
    }
  }

  // ======================
  // 🟢 Create
  // ======================
  async create(hostId: string, dto: CreateListingDto) {
    return this.listingModel.create({
      ...dto,
      host: new Types.ObjectId(hostId),
      amenities: dto.amenities?.map((id) => new Types.ObjectId(id)),
      images: dto.images?.map((id) => new Types.ObjectId(id)),
    });
  }

  // ======================
  // 🟡 Find All (filter for guest/admin)
  // ======================
  async findAll(filters: any = {}) {
    return this.listingModel
      .find(filters)
      .populate(['amenities', 'images', 'host']);
  }

  // ======================
  // 🔵 Find One
  // ======================
  async findOne(id: string) {
    const listing = await this.listingModel
      .findById(id)
      .populate(['amenities', 'images', 'host']);

    if (!listing) throw new NotFoundException('Listing not found');

    return listing;
  }

  // ======================
  // 🟠 Update (host only)
  // ======================
  async update(id: string, hostId: string, dto: UpdateListingDto) {
    const listing = await this.listingModel.findById(id);
    if (!listing) throw new NotFoundException('Listing not found');
    this.ensureHostPermission(listing, hostId);

    return this.listingModel.findByIdAndUpdate(id, dto, { new: true });
  }

  // ======================
  // 🔴 Delete (host only)
  // ======================
  async remove(id: string, hostId: string) {
    const listing = await this.listingModel.findById(id);
    if (!listing) throw new NotFoundException('Listing not found');
    this.ensureHostPermission(listing, hostId);

    return listing.deleteOne();
  }

  // ======================
  // ⭐ Add Rating (guest)
  // ======================
  async addRating(
    userId: string,
    dto: { listing: string; score: number; comment?: string },
  ) {
    const listing = await this.listingModel.findById(dto.listing);
    if (!listing) throw new NotFoundException('Listing not found');

    // Không cho rate 2 lần
    const existing = await this.ratingModel.findOne({
      listing: dto.listing,
      user: userId,
    });

    if (existing) {
      throw new ConflictException('You already rated this listing');
    }

    // Lưu rating mới
    const rating = await this.ratingModel.create({
      ...dto,
      user: userId,
    });

    // Recalculate rating
    const ratings = await this.ratingModel.find({ listing: dto.listing });
    const average =
      ratings.reduce((acc, r) => acc + r.score, 0) / ratings.length;

    await this.listingModel.findByIdAndUpdate(dto.listing, {
      averageRating: Number(average.toFixed(2)),
      totalReviews: ratings.length,
    });

    return rating;
  }
}
