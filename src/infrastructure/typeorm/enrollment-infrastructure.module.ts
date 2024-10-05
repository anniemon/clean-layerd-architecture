import { Module } from '@nestjs/common';
import { EnrollmentTypeOrmModule } from './repositories';

@Module({
  imports: [EnrollmentTypeOrmModule],
  exports: [EnrollmentTypeOrmModule],
})
export class EnrollmentInfrastructureModule {}
