import { Enrollment } from '@domain/entities';
import { EnrollmentStatus } from '@domain/enums';

export interface IEnrollmentRepository {
  createEnrollment(userId: string, lectureId: string): Promise<Enrollment>;
  findAllByUserIdStatus(
    userId: string,
    status: EnrollmentStatus,
  ): Promise<Enrollment[]>;
  updateEnrollmentStatusWithUserIdLectureId({
    userId,
    lectureId,
    status,
  }: {
    userId: string;
    lectureId: string;
    status: EnrollmentStatus;
  }): Promise<Enrollment>;
}
