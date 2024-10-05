import { Module } from '@nestjs/common';
import { UserTypeOrmModule } from './repositories';

@Module({
  imports: [UserTypeOrmModule],
  exports: [UserTypeOrmModule],
})
export class UserInfrastructureModule {}
