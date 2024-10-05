import { Module } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from '../entities/enrollment.entity';
import { Lecture } from '../entities/lecture.entity';
import { User } from '../entities/user.entity';
import { EnrollmentTypeOrmRepository } from './enrollment.repository';
import { LectureTypeOrmRepository } from './lecture.repository';
import dataSource from '../data-source';
import { UserTypeOrmRepository } from './user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment])],
  providers: [EnrollmentTypeOrmRepository],
  exports: [EnrollmentTypeOrmRepository],
})
export class EnrollmentTypeOrmModule {}
