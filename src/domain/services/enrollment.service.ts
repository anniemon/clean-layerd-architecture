import { Inject, Injectable } from '@nestjs/common';
import { EnrollmentStatus } from '@domain/enums';
import { EnrollmentTypeOrmRepository } from '@infrastructure/typeorm/repositories/enrollment.repository';
import { LectureTypeOrmRepository } from '@infrastructure/typeorm/repositories/lecture.repository';

@Injectable()
export class EnrollmentService {
  constructor(
    @Inject(EnrollmentTypeOrmRepository)
    private readonly enrollmentRepository: EnrollmentTypeOrmRepository,
    @Inject(LectureTypeOrmRepository)
    private readonly lectureRepository: LectureTypeOrmRepository,
  ) {}
  async findUserEnrollments(userId: string, status: EnrollmentStatus.ENROLLED) {
    const enrollments = await this.enrollmentRepository.findAllByUserIdStatus(
      userId,
      status,
    );
    return enrollments;
  }

  async updateEnrollmentWithIdStatus(
    enrollmentId: string,
    { status: EnrollmentStatus },
  ) {
    const enrollment =
      await this.enrollmentRepository.updateEnrollmentWithIdStatus(
        enrollmentId,
        EnrollmentStatus,
      );
    return enrollment;
  }

  async createEnrollment(enrollment: any) {
    const newEnrollment =
      await this.enrollmentRepository.createEnrollment(enrollment);
    return newEnrollment;
  }
}
