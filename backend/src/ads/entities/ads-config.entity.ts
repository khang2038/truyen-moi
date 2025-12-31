import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('ads_config')
export class AdsConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  adsTxt: string;

  @Column({ type: 'text', nullable: true })
  headerScript: string;

  @Column({ type: 'jsonb', default: [] })
  adInserts: Array<{
    position: number; // Position in chapter (0 = before first page, 1 = after first page, etc.)
    code: string; // Ad code HTML
    enabled: boolean;
  }>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

