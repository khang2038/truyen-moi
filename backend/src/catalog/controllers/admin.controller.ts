import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import { UserRole } from '../../users/user-role.enum';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CreateChapterDto } from '../dto/create-chapter.dto';
import { CreateSeriesDto } from '../dto/create-series.dto';
import { UpdateChapterDto } from '../dto/update-chapter.dto';
import { UpdateSeriesDto } from '../dto/update-series.dto';
import { CategoryService } from '../services/category.service';
import { ChapterService } from '../services/chapter.service';
import { SeriesService } from '../services/series.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.PUBLISHER)
@Controller('admin')
export class AdminCatalogController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly seriesService: SeriesService,
    private readonly chapterService: ChapterService,
  ) {}

  @Get('categories')
  listCategories() {
    return this.categoryService.findAll();
  }

  @Post('categories')
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Patch('categories/:categoryId')
  updateCategory(
    @Param('categoryId') categoryId: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(categoryId, dto);
  }

  @Delete('categories/:categoryId')
  deleteCategory(@Param('categoryId') categoryId: string) {
    return this.categoryService.remove(categoryId);
  }

  @Get('series')
  listSeries() {
    return this.seriesService.findAll(100);
  }

  @Post('series')
  createSeries(@Body() dto: CreateSeriesDto) {
    return this.seriesService.create(dto);
  }

  @Patch('series/:seriesId')
  updateSeries(
    @Param('seriesId') seriesId: string,
    @Body() dto: UpdateSeriesDto,
  ) {
    return this.seriesService.update(seriesId, dto);
  }

  @Delete('series/:seriesId')
  deleteSeries(@Param('seriesId') seriesId: string) {
    return this.seriesService.remove(seriesId);
  }

  @Post('series/:seriesId/chapters')
  createChapter(
    @Param('seriesId') seriesId: string,
    @Body() dto: CreateChapterDto,
  ) {
    return this.chapterService.create(seriesId, dto);
  }

  @Patch('chapters/:chapterId')
  updateChapter(
    @Param('chapterId') chapterId: string,
    @Body() dto: UpdateChapterDto,
  ) {
    return this.chapterService.update(chapterId, dto);
  }

  @Delete('chapters/:chapterId')
  deleteChapter(@Param('chapterId') chapterId: string) {
    return this.chapterService.remove(chapterId);
  }
}
