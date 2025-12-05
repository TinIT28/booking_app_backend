import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoModule } from './database/mongo.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [MongoModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
