import { Injectable } from '@nestjs/common';
import { LectureTypeOrmRepository } from '@infrastructure/typeorm/repositories/lecture.repository';

export class OptimisticLockVersionMismatchError extends Error {
  constructor() {
    super('Optimistic lock version mismatch');
  }
}

@Injectable()
export class LectureService {
  constructor(private readonly lectureRepository: LectureTypeOrmRepository) {}
  async findOneByLectureId(lectureId: string) {
    return this.lectureRepository.findOneByLectureId(lectureId);
  }

  async getSlots(lectureId: string): Promise<number> {
    return this.lectureRepository.getAvailableSlots(lectureId);
  }

  async decreaseAvailableSlotsWithVersion(lectureId: string) {
    const result =
      await this.lectureRepository.decreaseAvailableSlotsWithVersion(lectureId);
    return result;
  }

  async isLectureFull(lectureId: string): Promise<boolean> {
    return this.lectureRepository.isLectureFull(lectureId);
  }

  async findAllAvailableLecturesByDate(date: string) {
    return this.lectureRepository.findAllAvailableLecturesByDate(date);
  }
}
