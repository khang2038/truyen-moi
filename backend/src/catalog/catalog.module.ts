import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Series } from './entities/series.entity';
import { Chapter } from './entities/chapter.entity';
import { CategoryService } from './services/category.service';
import { SeriesService } from './services/series.service';
import { ChapterService } from './services/chapter.service';
import { PublicCatalogController, PublicCategoryController } from './controllers/public.controller';
import { AdminCatalogController } from './controllers/admin.controller';
import { UploadController } from './controllers/upload.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Series, Chapter]),
    AuthModule,
  ],
  controllers: [
    PublicCatalogController,
    PublicCategoryController,
    AdminCatalogController,
    UploadController,
  ],
  providers: [CategoryService, SeriesService, ChapterService],
  exports: [SeriesService, ChapterService],
})
export class CatalogModule {}
