import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserTypeOrmRepository } from './user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserTypeOrmRepository],
  exports: [UserTypeOrmRepository],
})
export class UserTypeOrmModule {}
