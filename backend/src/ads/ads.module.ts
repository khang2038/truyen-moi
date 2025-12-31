import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdsConfig } from './entities/ads-config.entity';
import { AdsService } from './ads.service';
import { AdsController } from './ads.controller';
import { AdminAdsController } from './admin-ads.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AdsConfig])],
  controllers: [AdsController, AdminAdsController],
  providers: [AdsService],
  exports: [AdsService],
})
export class AdsModule {}

