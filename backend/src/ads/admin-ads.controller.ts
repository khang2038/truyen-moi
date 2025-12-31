import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { AdsService } from './ads.service';
import { UpdateAdsConfigDto } from './dto/update-ads-config.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user-role.enum';

@Controller('admin/ads')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminAdsController {
  constructor(private readonly adsService: AdsService) {}

  @Get()
  async getConfig() {
    return this.adsService.getConfig();
  }

  @Put()
  async updateConfig(@Body() dto: UpdateAdsConfigDto) {
    return this.adsService.updateConfig(dto);
  }
}

