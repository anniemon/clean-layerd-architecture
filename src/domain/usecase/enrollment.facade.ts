import { EnrollmentStatus } from '@domain/enums';
import {
  EnrollmentService,
  LectureService,
  OptimisticLockVersionMismatchError,
} from '@domain/services';
import { Injectable } from '@nestjs/common';

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
    delay: number = 100,
  ): Promise<any> {
    const enrollment = await this.enrollmentService.createEnrollment({
      userId,
      lectureId,
      status: EnrollmentStatus.PENDING,
    });

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        await this.enrollLecture(userId, lectureId); // 등록 시도
        await this.enrollmentService.updateEnrollmentWithIdStatus(
          enrollment.id,
          {
            status: EnrollmentStatus.ENROLLED,
          },
        );
        return { status: EnrollmentStatus.ENROLLED };
      } catch (error) {
        if (error instanceof OptimisticLockVersionMismatchError) {
          // await this.enrollmentService.updateEnrollmentWithIdStatus(
          //   enrollment.id,
          //   {
          //     status: EnrollmentStatus.REJECTED,
          //   },
          // );
          if (attempt === retries - 1) {
            throw new Error('Lecture is full after multiple attempts');
          }
          // 충돌 시 재시도
          await new Promise((resolve) => setTimeout(resolve, delay));

          delay *= 2;
          continue;
        }
        // 다른 오류는 그대로 throw
        await this.enrollmentService.updateEnrollmentWithIdStatus(
          enrollment.id,
          {
            status: EnrollmentStatus.REJECTED,
          },
        );
        throw error;
      }
    }
  }

  private async enrollLecture(userId: string, lectureId: string) {
    const lecture = await this.lectureService.findOneByLectureId(lectureId);
    if (!lecture) {
      throw new Error('Lecture not found');
    }
    const availableSlots = await this.lectureService.getSlots(lectureId);
    if (availableSlots <= 0) {
      throw new Error('Lecture is full');
    }

    await this.lectureService.decreaseAvailableSlotsWithVersion(
      lectureId,
      lecture.version,
    );

    // console.log(updateResult.affected, 'updateResult.affected');
    // return { updated: updateResult.affected };
  }

  async findUserEnrollments(userId: string, status: EnrollmentStatus.ENROLLED) {
    console.log(userId, status, 'enroll facade');
    return this.enrollmentService.findUserEnrollments(userId, status);
  }
}
