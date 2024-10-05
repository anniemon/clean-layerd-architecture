import { Module } from '@nestjs/common';
import { LectureController } from '@application/controllers/lecture.controller';
import { LectureService } from '@domain/services';
import { LectureInfrastructureModule } from '@infrastructure/typeorm/lecture-infrastructure.module';
import { LectureTypeOrmRepository } from '@infrastructure/typeorm/repositories/lecture.repository';

@Module({
  imports: [LectureInfrastructureModule],
  controllers: [LectureController],

  providers: [LectureService, LectureTypeOrmRepository],
})
export class LectureModule {}
