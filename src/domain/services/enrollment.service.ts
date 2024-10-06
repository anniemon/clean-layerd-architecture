import { BadRequestException, Inject, Injectable } from '@nestjs/common';
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

  async updateEnrollmentStatusWithUserIdLectureId({
    userId,
    lectureId,
    status,
  }: {
    userId: string;
    lectureId: string;
    status: EnrollmentStatus;
  }) {
    const enrollment =
      await this.enrollmentRepository.updateEnrollmentStatusWithUserIdLectureId(
        {
          userId,
          lectureId,
          status,
        },
      );
    return enrollment;
  }

  async createEnrollment(userId: string, lectureId: string) {
    try {
      const newEnrollment = await this.enrollmentRepository.createEnrollment(
        userId,
        lectureId,
      );
      return newEnrollment;
    } catch (error) {
      throw new BadRequestException('Duplicated enrollment');
    }
  }
}
