import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { IEnrollmentRepository } from '@interfaces/repository/enrollment.repository.interface';
import { Enrollment } from '../entities/enrollment.entity';
import { EnrollmentStatus } from '@domain/enums';

@Injectable()
export class EnrollmentTypeOrmRepository
  extends Repository<Enrollment>
  implements IEnrollmentRepository
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    super(Enrollment, dataSource.createEntityManager());
  }

  async findAllByUserIdStatus(
    userId: string,
    status: EnrollmentStatus,
  ): Promise<Enrollment[]> {
    console.log(userId, status, 'enrollment.repository.ts');
    return this.createQueryBuilder(this.metadata.tableName)
      .leftJoinAndSelect('user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('status = :status', { status })
      .getMany();
  }

  async createEnrollment(enrollment: Enrollment): Promise<Enrollment> {
    return this.save(enrollment);
  }

  async updateEnrollmentWithIdStatus(
    enrollmentId: string,
    status: string,
  ): Promise<Enrollment> {
    const enrollment = await this.findOne({
      where: { id: enrollmentId },
    });
    if (!enrollment) {
      return null;
    }
    enrollment.status = status;
    return this.save(enrollment);
  }
}
