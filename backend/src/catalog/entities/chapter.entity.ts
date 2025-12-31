import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Series } from './series.entity';
import { Comment } from '../../comments/comment.entity';

@Entity('chapters')
@Unique(['seriesId', 'index'])
export class Chapter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  slug?: string;

  @Column({ type: 'int' })
  index: number;

  @Column({ type: 'text', nullable: true })
  summary?: string;

  @Column({ type: 'jsonb', default: [] })
  pages: string[];

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'int', default: 0 })
  readCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Series, (series) => series.chapters, {
    onDelete: 'CASCADE',
  })
  series: Series;

  @Column()
  seriesId: string;

  @OneToMany(() => Comment, (comment) => comment.chapter)
  comments: Comment[];
}
