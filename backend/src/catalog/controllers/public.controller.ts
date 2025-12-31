import { Controller, Get, Param, Query, NotFoundException, InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common';
import { ChapterService } from '../services/chapter.service';
import { SeriesService } from '../services/series.service';
import { CategoryService } from '../services/category.service';

@Controller('series')
export class PublicCatalogController {
  constructor(
    private readonly seriesService: SeriesService,
    private readonly chapterService: ChapterService,
    private readonly categoryService: CategoryService,
  ) {}

  @Get()
  async list(@Query('limit') limit?: string) {
    const take = limit ? Number(limit) : 20;
    const [series, trending, featured] = await Promise.all([
      this.seriesService.findAll(take),
      this.seriesService.findTrending(8),
      this.seriesService.findFeatured(1),
    ]);
    return { series, trending, featured: featured[0] || null };
  }

  @Get(':slug')
  async detail(@Param('slug') slug: string) {
    const series = await this.seriesService.findOneBySlug(slug, false);
    return series;
  }

  @Get(':slug/chapters')
  async listChapters(@Param('slug') slug: string) {
    try {
      const series = await this.seriesService.findOneBySlug(slug, false);
      if (!series) {
        throw new NotFoundException('Series not found');
      }
      const chapters = await this.chapterService.listBySeries(series.id);
      // Remove chapters from series to avoid circular reference and duplicate data
      const { chapters: _, ...seriesWithoutChapters } = series;
      return { series: seriesWithoutChapters, chapters };
    } catch (error: any) {
      console.error('[PublicCatalogController] Error listing chapters:', {
        slug,
        error: error.message,
        stack: error.stack,
      });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch chapters');
    }
  }

  @Get(':slug/chapters/:chapterSlug')
  async readChapter(
    @Param('slug') slug: string,
    @Param('chapterSlug') chapterSlug: string,
  ) {
    try {
      console.log(`[PublicCatalogController] Reading chapter: series="${slug}", chapter="${chapterSlug}"`);
      const { series, chapter, prev, next } =
        await this.chapterService.findWithSeriesAndSiblings(slug, chapterSlug);
      console.log(`[PublicCatalogController] Found chapter: ${chapter.title}`);
      return { series, chapter, prev, next };
    } catch (error: any) {
      console.error('[PublicCatalogController] Error reading chapter:', {
        slug,
        chapterSlug,
        error: error.message,
        stack: error.stack,
      });
      if (error.message === 'Series not found' || error.message === 'Chapter not found') {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException('Failed to fetch chapter');
    }
  }

  @Get('ranking/:period')
  async ranking(
    @Param('period') period: 'day' | 'week' | 'month',
    @Query('limit') limit?: string,
  ) {
    const take = limit ? Number(limit) : 10;
    const ranking = await this.seriesService.findRanking(period, take);
    return { period, ranking };
  }
}

@Controller('categories')
export class PublicCategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly seriesService: SeriesService,
  ) {}

  @Get()
  async list() {
    return this.categoryService.findAll();
  }

  @Get(':slug/series')
  async listSeriesByCategory(@Param('slug') slug: string, @Query('limit') limit?: string) {
    console.log(`[CategoryController] Fetching series for category slug: ${slug}`);
    const category = await this.categoryService.findOneBySlug(slug);
    console.log(`[CategoryController] Found category:`, category ? { id: category.id, name: category.name, slug: category.slug } : 'null');
    if (!category) {
      return { category: null, series: [] };
    }
    const take = limit ? Number(limit) : 50;
    const series = await this.seriesService.findByCategory(category.id, take);
    console.log(`[CategoryController] Found ${series.length} series for category ${category.name}`);
    return { category, series };
  }
}
