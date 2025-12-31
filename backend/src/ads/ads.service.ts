import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdsConfig } from './entities/ads-config.entity';
import { UpdateAdsConfigDto } from './dto/update-ads-config.dto';

@Injectable()
export class AdsService {
  constructor(
    @InjectRepository(AdsConfig)
    private readonly adsRepo: Repository<AdsConfig>,
  ) {}

  async getConfig() {
    let config = await this.adsRepo.findOne({ where: {} });
    if (!config) {
      config = this.adsRepo.create({
        adsTxt: '',
        headerScript: '',
        adInserts: [],
      });
      config = await this.adsRepo.save(config);
    }
    return config;
  }

  async updateConfig(dto: UpdateAdsConfigDto) {
    let config = await this.adsRepo.findOne({ where: {} });
    if (!config) {
      config = this.adsRepo.create({});
    }
    if (dto.adsTxt !== undefined) config.adsTxt = dto.adsTxt;
    if (dto.headerScript !== undefined) config.headerScript = dto.headerScript;
    if (dto.adInserts !== undefined) config.adInserts = dto.adInserts;
    return this.adsRepo.save(config);
  }

  async getHeaderScript() {
    const config = await this.getConfig();
    return config.headerScript || '';
  }

  async getAdsTxt() {
    const config = await this.getConfig();
    return config.adsTxt || '';
  }

  async getAdInserts() {
    const config = await this.getConfig();
    return config.adInserts.filter((ad) => ad.enabled) || [];
  }
}

