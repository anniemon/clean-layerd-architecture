import { Module } from '@nestjs/common';
import { LectureTypeOrmModule } from './repositories';

@Module({
  imports: [LectureTypeOrmModule],
  exports: [LectureTypeOrmModule],
})
export class LectureInfrastructureModule {}
