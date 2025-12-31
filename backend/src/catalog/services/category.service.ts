import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { slugify } from '../../common/utils/slugify';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async findAll() {
    return this.categoryRepo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string) {
    return this.categoryRepo.findOne({ where: { id } });
  }

  async findOneBySlug(slug: string) {
    if (!slug) {
      console.log('[CategoryService] findOneBySlug: slug is empty');
      return null;
    }
    const normalized = slugify(slug);
    console.log(`[CategoryService] findOneBySlug: original="${slug}", normalized="${normalized}"`);
    const result = await this.categoryRepo
      .createQueryBuilder('category')
      .where('LOWER(category.slug) = LOWER(:slug)', { slug: normalized })
      .orWhere('LOWER(category.name) = LOWER(:slug)', { slug: normalized })
      .getOne();
    console.log(`[CategoryService] findOneBySlug result:`, result ? { id: result.id, name: result.name, slug: result.slug } : 'null');
    return result;
  }

  async create(dto: CreateCategoryDto) {
    const category = this.categoryRepo.create({
      name: dto.name,
      slug: slugify(dto.name),
      description: dto.description,
    });
    return this.categoryRepo.save(category);
  }
}
