import { Controller, Get } from '@nestjs/common';
import { LectureService } from '@domain/services';

@Controller('lectures')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @Get('available')
  async findLectures(date: string) {
    const lectures =
      await this.lectureService.findAllAvailableLecturesByDate(date);
    return lectures;
  }
}
