import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chapter } from '../entities/chapter.entity';
import { Series } from '../entities/series.entity';
import { CreateChapterDto } from '../dto/create-chapter.dto';
import { UpdateChapterDto } from '../dto/update-chapter.dto';
import { slugify } from '../../common/utils/slugify';

@Injectable()
export class ChapterService {
  constructor(
    @InjectRepository(Chapter)
    private readonly chapterRepo: Repository<Chapter>,
    @InjectRepository(Series)
    private readonly seriesRepo: Repository<Series>,
  ) {}

  async listBySeries(seriesId: string) {
    try {
      const chapters = await this.chapterRepo.find({
        where: { seriesId },
        order: { index: 'ASC' },
        relations: [], // Don't load series relation to avoid circular reference
      });
      
      // Migrate chapters without slug
      const chaptersToUpdate = chapters.filter(ch => !ch.slug);
      if (chaptersToUpdate.length > 0) {
        console.log(`[ChapterService] Migrating ${chaptersToUpdate.length} chapters without slug`);
        for (const ch of chaptersToUpdate) {
          ch.slug = `${slugify(ch.title)}-${ch.index}`;
          await this.chapterRepo.save(ch);
        }
        // Reload after migration
        return this.chapterRepo.find({
          where: { seriesId },
          order: { index: 'ASC' },
          relations: [],
        });
      }
      
      console.log(`[ChapterService] Found ${chapters.length} chapters for seriesId: ${seriesId}`);
      return chapters;
    } catch (error) {
      console.error(`[ChapterService] Error listing chapters for seriesId ${seriesId}:`, error);
      throw error;
    }
  }

  async findOne(id: string) {
    return this.chapterRepo.findOne({
      where: { id },
      relations: ['series'],
    });
  }

  async findWithSeriesAndSiblings(slug: string, chapterSlug: string) {
    const series = await this.seriesRepo.findOne({ where: { slug } });
    if (!series) {
      console.error(`[ChapterService] Series not found with slug: ${slug}`);
      throw new Error('Series not found');
    }

    console.log(`[ChapterService] Finding chapter: seriesId=${series.id}, chapterSlug=${chapterSlug}`);
    
    // Try to find by slug first
    let chapter = await this.chapterRepo.findOne({
      where: { slug: chapterSlug, seriesId: series.id },
    });
    
    // If not found by slug, try by id (for backward compatibility)
    if (!chapter) {
      console.log(`[ChapterService] Chapter not found by slug, trying by id`);
      chapter = await this.chapterRepo.findOne({
        where: { id: chapterSlug, seriesId: series.id },
      });
    }
    
    if (!chapter) {
      console.error(`[ChapterService] Chapter not found: slug=${chapterSlug}, seriesId=${series.id}`);
      throw new Error('Chapter not found');
    }
    
    console.log(`[ChapterService] Found chapter: id=${chapter.id}, title=${chapter.title}, slug=${chapter.slug}`);

    const [prev, next] = await Promise.all([
      this.chapterRepo.findOne({
        where: { seriesId: series.id, index: chapter.index - 1 },
      }),
      this.chapterRepo.findOne({
        where: { seriesId: series.id, index: chapter.index + 1 },
      }),
    ]);

    await this.chapterRepo.increment({ id: chapter.id }, 'viewCount', 1);
    await this.seriesRepo.increment({ id: series.id }, 'viewCount', 1);

    return { series, chapter, prev, next };
  }

  async create(seriesId: string, dto: CreateChapterDto) {
    const series = await this.seriesRepo.findOne({ where: { id: seriesId } });
    if (!series) throw new Error('Series not found');

    const slug = dto.title ? `${slugify(dto.title)}-${dto.index || Date.now()}` : undefined;
    const chapter = this.chapterRepo.create({
      ...dto,
      slug,
      seriesId,
    });

    return this.chapterRepo.save(chapter);
  }

  async update(id: string, dto: UpdateChapterDto) {
    const chapter = await this.findOne(id);
    if (!chapter) throw new Error('Chapter not found');

    if (dto.title !== undefined) {
      chapter.title = dto.title;
      // Update slug when title changes
      chapter.slug = `${slugify(dto.title)}-${chapter.index || Date.now()}`;
    }
    if (dto.index !== undefined) {
      chapter.index = dto.index;
      // Update slug when index changes
      if (chapter.title) {
        chapter.slug = `${slugify(chapter.title)}-${dto.index}`;
      }
    }
    if (dto.summary !== undefined) chapter.summary = dto.summary;
    if (dto.pages !== undefined) chapter.pages = dto.pages;

    return this.chapterRepo.save(chapter);
  }

  async remove(id: string) {
    const chapter = await this.findOne(id);
    if (!chapter) throw new Error('Chapter not found');
    await this.chapterRepo.remove(chapter);
    return { message: 'Chapter deleted' };
  }

  async incrementRead(id: string) {
    await this.chapterRepo.increment({ id }, 'readCount', 1);
    const chapter = await this.findOne(id);
    if (chapter) {
      await this.seriesRepo.increment({ id: chapter.seriesId }, 'readCount', 1);
    }
  }
}
