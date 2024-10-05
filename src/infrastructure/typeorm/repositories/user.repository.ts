import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../entities/User.entity';

@Injectable()
export class UserTypeOrmRepository extends Repository<User> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    super(User, dataSource.createEntityManager());
  }

  async findOneByUserId(UserId: string): Promise<User> {
    return this.findOne({ where: { id: UserId } });
  }
}
