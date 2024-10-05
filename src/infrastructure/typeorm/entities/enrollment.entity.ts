import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Lecture } from './lecture.entity';
import { User } from './user.entity';

@Entity()
@Unique('enrollment_user_lecture_unique', ['userId', 'lectureId'])
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', default: 'PENDING' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'date', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Lecture)
  @JoinColumn({ name: 'lecture_id', referencedColumnName: 'id' })
  lectureId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  userId: string;
}
