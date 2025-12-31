import { Controller, Get, Res } from '@nestjs/common';
import { AdsService } from './ads.service';
import { Response } from 'express';

@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Get('ads.txt')
  async getAdsTxt(@Res() res: Response) {
    const content = await this.adsService.getAdsTxt();
    res.setHeader('Content-Type', 'text/plain');
    res.send(content);
  }

  @Get('inserts')
  async getAdInserts() {
    const inserts = await this.adsService.getAdInserts();
    return { inserts };
  }
}

