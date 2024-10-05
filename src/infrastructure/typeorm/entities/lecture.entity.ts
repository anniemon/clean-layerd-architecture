import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  VersionColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Lecture {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  date: string;

  @Column('varchar')
  faculty: string;

  @Column('varchar')
  title: string;

  @Column('varchar')
  subtitle: string;

  @Column('varchar')
  description: string;

  @Column('integer', { default: 30 })
  slot: number;

  @VersionColumn() // 낙관적 락 제어용 버전 관리 필드
  version: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'date', nullable: true })
  deletedAt: Date | null;
}
