import { Module } from '@nestjs/common';
import { EnrollmentController } from '@application/controllers/enrollment.controller';
import { EnrollmentService, LectureService } from '@domain/services';
import { EnrollmentFacade } from '@domain/usecase/enrollment.facade';
import {
  EnrollmentTypeOrmModule,
  LectureTypeOrmModule,
  UserTypeOrmModule,
} from '@infrastructure/typeorm/repositories';

@Module({
  imports: [EnrollmentTypeOrmModule, LectureTypeOrmModule, UserTypeOrmModule],
  controllers: [EnrollmentController],
  providers: [EnrollmentFacade, EnrollmentService, LectureService],
})
export class EnrollmentModule {}
