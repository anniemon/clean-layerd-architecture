import { Enrollment } from '@domain/entities';
import { EnrollmentStatus } from '@domain/enums';

export interface IEnrollmentRepository {
  createEnrollment(enrollment: Enrollment): Promise<Enrollment>;
  findAllByUserIdStatus(
    userId: string,
    status: EnrollmentStatus,
  ): Promise<Enrollment[]>;
  updateEnrollmentWithIdStatus(
    enrollmentId: string,
    status: EnrollmentStatus,
  ): Promise<Enrollment> | Promise<null>;
}
