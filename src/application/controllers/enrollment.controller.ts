import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { EnrollmentDTO } from '../dtos';
import { EnrollmentStatus } from '@domain/enums';
import { EnrollmentFacade } from '@domain/usecase/enrollment.facade';

@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentFacade: EnrollmentFacade) {}

  @Get()
  async findUserEnrollments(
    @Query('userId') userId: string,
    @Query('status') status: EnrollmentStatus.ENROLLED,
  ) {
    console.log(userId, status, 'userId, status');
    const enrollments = await this.enrollmentFacade.findUserEnrollments(
      userId,
      status,
    );
    return { enrollments };
  }

  @Post()
  async enrollLecture(@Body() body: EnrollmentDTO) {
    const { userId, lectureId } = body;
    const result = await this.enrollmentFacade.enrollLectureWithRetry(
      userId,
      lectureId,
    );
    return result;
  }
}
