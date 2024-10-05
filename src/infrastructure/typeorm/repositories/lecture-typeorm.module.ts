import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lecture } from '../entities/lecture.entity';
import { LectureTypeOrmRepository } from './lecture.repository';
import { User } from '../entities/user.entity';
import { UserTypeOrmRepository } from './user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Lecture, User])],
  providers: [LectureTypeOrmRepository, UserTypeOrmRepository],
  exports: [LectureTypeOrmRepository],
})
export class LectureTypeOrmModule {}
