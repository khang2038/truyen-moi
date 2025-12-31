import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Chapter } from '../catalog/entities/chapter.entity';
import { User } from '../users/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(Chapter)
    private readonly chapterRepo: Repository<Chapter>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async listForChapter(chapterId: string) {
    return this.commentRepo.find({
      where: { chapterId, isDeleted: false },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async createForChapter(
    chapterId: string,
    dto: CreateCommentDto,
    userId?: string,
  ) {
    const chapter = await this.chapterRepo.findOne({ where: { id: chapterId } });
    if (!chapter) {
      throw new Error('Chapter not found');
    }

    let user: User | null = null;
    if (userId) {
      user = await this.userRepo.findOne({ where: { id: userId } });
    }

    const comment = this.commentRepo.create({
      content: dto.content,
      authorName:
        dto.authorName || (user ? user.displayName || user.email : 'Ẩn danh'),
      userId: user?.id,
      chapterId,
    });

    return this.commentRepo.save(comment);
  }
}

