import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Series } from '../entities/series.entity';
import { Category } from '../entities/category.entity';
import { CreateSeriesDto } from '../dto/create-series.dto';
import { UpdateSeriesDto } from '../dto/update-series.dto';
import { slugify } from '../../common/utils/slugify';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(Series)
    private readonly seriesRepo: Repository<Series>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async findAll(limit: number = 20) {
    return this.seriesRepo.find({
      relations: ['categories'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findTrending(limit: number = 8) {
    return this.seriesRepo.find({
      relations: ['categories'],
      order: { viewCount: 'DESC', readCount: 'DESC' },
      take: limit,
    });
  }

  async findFeatured(limit: number = 1) {
    return this.seriesRepo.find({
      relations: ['categories'],
      order: { readCount: 'DESC', viewCount: 'DESC' },
      take: limit,
    });
  }

  async findOne(id: string, includeChapters = true) {
    const relations = ['categories'];
    if (includeChapters) {
      relations.push('chapters');
    }
    return this.seriesRepo.findOne({
      where: { id },
      relations,
    });
  }

  async findOneBySlug(slug: string, includeChapters = false) {
    const relations = ['categories'];
    if (includeChapters) {
      relations.push('chapters');
    }
    return this.seriesRepo.findOne({
      where: { slug },
      relations,
    });
  }

  async create(dto: CreateSeriesDto) {
    const series = this.seriesRepo.create({
      title: dto.title,
      slug: slugify(dto.title),
      description: dto.description,
      coverImage: dto.coverImage,
      author: dto.author,
      status: dto.status || 'ongoing',
      tags: dto.tags || [],
    });

    if (dto.categoryIds && dto.categoryIds.length > 0) {
      const categories = await this.categoryRepo.findBy({
        id: In(dto.categoryIds),
      });
      series.categories = categories;
    }

    return this.seriesRepo.save(series);
  }

  async update(id: string, dto: UpdateSeriesDto) {
    const series = await this.findOne(id);
    if (!series) throw new Error('Series not found');

    if (dto.title) {
      series.title = dto.title;
      series.slug = slugify(dto.title);
    }
    if (dto.description !== undefined) series.description = dto.description;
    if (dto.coverImage !== undefined) series.coverImage = dto.coverImage;
    if (dto.author !== undefined) series.author = dto.author;
    if (dto.status !== undefined) series.status = dto.status;
    if (dto.tags !== undefined) series.tags = dto.tags;

    if (dto.categoryIds !== undefined) {
      const categories = await this.categoryRepo.findBy({
        id: In(dto.categoryIds),
      });
      series.categories = categories;
    }

    return this.seriesRepo.save(series);
  }

  async remove(id: string) {
    const series = await this.findOne(id);
    if (!series) throw new Error('Series not found');
    
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    
    // Delete cover image if exists
    if (series.coverImage) {
      try {
        const coverImagePath = this.extractFilePath(series.coverImage, uploadDir);
        if (coverImagePath && existsSync(coverImagePath)) {
          await unlink(coverImagePath);
          console.log(`[SeriesService] Deleted cover image: ${coverImagePath}`);
        }
      } catch (error) {
        console.error(`[SeriesService] Error deleting cover image:`, error);
        // Continue deletion even if image deletion fails
      }
    }
    
    // Delete all chapter images
    if (series.chapters && series.chapters.length > 0) {
      for (const chapter of series.chapters) {
        if (chapter.pages && chapter.pages.length > 0) {
          for (const pageUrl of chapter.pages) {
            try {
              const pagePath = this.extractFilePath(pageUrl, uploadDir);
              if (pagePath && existsSync(pagePath)) {
                await unlink(pagePath);
                console.log(`[SeriesService] Deleted chapter page: ${pagePath}`);
              }
            } catch (error) {
              console.error(`[SeriesService] Error deleting chapter page:`, error);
              // Continue deletion even if image deletion fails
            }
          }
        }
      }
    }
    
    await this.seriesRepo.remove(series);
    return { message: 'Series deleted' };
  }

  /**
   * Extract file path from URL
   * Example: http://localhost:8080/uploads/123456.jpg -> ./uploads/123456.jpg
   */
  private extractFilePath(url: string, uploadDir: string): string | null {
    if (!url) return null;
    
    // Extract filename from URL (everything after last /)
    const filename = url.split('/').pop();
    if (!filename) return null;
    
    // Remove query parameters if any
    const cleanFilename = filename.split('?')[0];
    
    // Return full path
    return join(process.cwd(), uploadDir, cleanFilename);
  }

  async incrementView(id: string) {
    await this.seriesRepo.increment({ id }, 'viewCount', 1);
  }

  async incrementRead(id: string) {
    await this.seriesRepo.increment({ id }, 'readCount', 1);
  }

  async findRanking(period: 'day' | 'week' | 'month', limit: number = 10) {
    return this.seriesRepo.find({
      relations: ['categories'],
      order: { readCount: 'DESC', viewCount: 'DESC' },
      take: limit,
    });
  }

  async findByCategory(categoryId: string, limit: number = 50) {
    console.log(`[SeriesService] Finding series for categoryId: ${categoryId}`);
    const result = await this.seriesRepo
      .createQueryBuilder('series')
      .innerJoin('series.categories', 'category')
      .leftJoinAndSelect('series.categories', 'categories')
      .where('category.id = :categoryId', { categoryId })
      .orderBy('series.createdAt', 'DESC')
      .take(limit)
      .getMany();
    console.log(`[SeriesService] Found ${result.length} series`);
    return result;
  }
}
