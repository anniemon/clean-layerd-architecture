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

  async decreaseAvailableSlotsWithVersion(lectureId: string) {
    const result = await this.createQueryBuilder()
      .update(Lecture)
      .set({ slot: () => 'slot - 1', version: () => 'version + 1' })
      .where('id = :lectureId', { lectureId })
      .andWhere('slot > 0')
      .andWhere((qb) => {
        const subQuery = this.createQueryBuilder('lecture')
          .select('lecture.version')
          .where('lecture.id = :lectureId')
          .getQuery();
        return `version = (${subQuery})`;
      })
      .execute();

    if (result.affected === 0) {
      throw new Error('no available slot');
    }
    return result;
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
