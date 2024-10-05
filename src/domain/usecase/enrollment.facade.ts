import { EnrollmentStatus } from '@domain/enums';
import {
  EnrollmentService,
  LectureService,
  OptimisticLockVersionMismatchError,
} from '@domain/services';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class EnrollmentFacade {
  constructor(
    private readonly enrollmentService: EnrollmentService,
    private readonly lectureService: LectureService,
  ) {
    this.enrollmentService = enrollmentService;
    this.lectureService = lectureService;
  }
  // TODO: move details to the service
  async enrollLectureWithRetry(
    userId: string,
    lectureId: string,
    retries: number = 3,
  ): Promise<any> {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        await this.enrollLecture(userId, lectureId);

        const enrollment = await this.enrollmentService.createEnrollment(
          userId,
          lectureId,
        );
        return { status: enrollment.status };
      } catch (error) {
        // 중복 수강 신청일 경우
        if (error.name === 'BadRequestException') {
          throw error;
        }
        // 재시도 카운트 초과 시에 에러 발생
        if (attempt === retries - 1) {
          throw new InternalServerErrorException('Enrollment failed');
        }

        continue;
      }
    }
  }

  // TODO: remove unused userId
  async enrollLecture(userId: string, lectureId: string) {
    const result =
      await this.lectureService.decreaseAvailableSlotsWithVersion(lectureId);
    return result;
  }

  async findUserEnrollments(userId: string, status: EnrollmentStatus.ENROLLED) {
    return this.enrollmentService.findUserEnrollments(userId, status);
  }
}
