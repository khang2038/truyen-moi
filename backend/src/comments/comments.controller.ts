import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('chapter/:chapterId')
  listForChapter(@Param('chapterId') chapterId: string) {
    return this.commentsService.listForChapter(chapterId);
  }

  @Post('chapter/:chapterId')
  async createForChapter(
    @Param('chapterId') chapterId: string,
    @Body() dto: CreateCommentDto,
    @Req() req: Request,
  ) {
    const user = (req as any).user as { userId?: string } | undefined;
    const userId = user?.userId;
    return this.commentsService.createForChapter(chapterId, dto, userId);
  }
}

