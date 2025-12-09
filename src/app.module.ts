import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoModule } from './database/mongo.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ListingsModule } from './listings/listings.module';
import { AmenitiesModule } from './amenity/amenities.module';
import { UploadModule } from './cloudinary/upload.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongoModule,
    UsersModule,
    AuthModule,
    ListingsModule,
    AmenitiesModule,
    UploadModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
