import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';
import { Category } from './category.entity';
import { Chapter } from './chapter.entity';

@Entity('series')
export class Series {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  coverImage?: string;

  @Column({ nullable: true })
  author?: string;

  @Column({ default: 'ongoing' })
  status: string;

  @Column({ type: 'jsonb', default: [] })
  tags: string[];

  @ManyToMany(() => Category, (category) => category.series)
  @JoinTable()
  categories: Category[];

  @OneToMany(() => Chapter, (chapter) => chapter.series, {
    cascade: true,
  })
  chapters: Chapter[];

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'int', default: 0 })
  readCount: number;

  @CreateDateColumn()
  createdAt: Date;
}
