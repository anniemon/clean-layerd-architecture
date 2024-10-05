import { Lecture } from '@domain/entities';

export interface ILectureRepository {
  getAvailableSlots(lectureId: string): Promise<number>;
  decreaseAvailableSlotsWithVersion(lectureId, lectureVersion);
  isLectureFull(lectureId: string): Promise<boolean>;
  findAllAvailableLecturesByDate(date: string): Promise<Lecture[]>;
  findOneByLectureId(lectureId: string): Promise<Lecture>;
}
