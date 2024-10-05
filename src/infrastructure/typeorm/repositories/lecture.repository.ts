import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, Not, UpdateResult } from 'typeorm';
import { ILectureRepository } from '@interfaces/repository/lecture.repository.interface';
import { Lecture } from '../entities/lecture.entity';

@Injectable()
export class LectureTypeOrmRepository
  extends Repository<Lecture>
  implements ILectureRepository
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    super(Lecture, dataSource.createEntityManager());
  }

  async findOneByLectureId(lectureId: string): Promise<Lecture> {
    return this.findOne({ where: { id: lectureId } });
  }

  async getAvailableSlots(lectureId: string): Promise<number> {
    const lecture = await this.findOne({
      where: { id: lectureId },
    });
    return lecture.slot;
  }

  async decreaseAvailableSlotsWithVersion(
    lectureId: string,
    lectureVersion: number,
  ) {
    // TODO: add retry logic
    return await this.createQueryBuilder()
      .update(Lecture)
      .set({ slot: () => 'slot - 1' })
      .where('id = :lectureId', { lectureId })
      .andWhere('version = :version', { version: lectureVersion }) // 버전 검증
      .execute();
  }

  async isLectureFull(lectureId: string): Promise<boolean> {
    const lecture = await this.findOne({
      where: { id: lectureId },
    });
    return lecture.slot === 0;
  }

  async findAllAvailableLecturesByDate(date: string): Promise<Lecture[]> {
    return this.find({
      where: { date, slot: Not(0) },
    });
  }
}
