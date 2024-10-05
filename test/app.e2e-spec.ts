import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/infrastructure/modules/app.module';
import { INestApplication } from '@nestjs/common';
import { fixtures } from '../src/infrastructure/typeorm/helper/fixtures';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Enrollment', () => {
  let app: INestApplication;
  let server;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = await app.getHttpServer();
  });

  /**
   * 날짜별로 현재 신청 가능한 특강 목록 조회
   */
  describe('/lectures (GET)', () => {
    it('should return available lectures with information', async () => {
      const result = await request(server)
        .get(`/lectures/available?date=${fixtures.lecture[0].date}`)
        .expect(200);

      expect(result.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: fixtures.lecture[0].id,
            title: fixtures.lecture[0].title,
            faculty: fixtures.lecture[0].faculty,
            date: fixtures.lecture[0].date,
          }),
        ]),
      );
    });
  });

  describe('/enrollments (POST)', () => {
    it('동일한 유저 정보로 같은 특강을 5번 신청했을 때, 1번만 성공해야 한다.', async () => {
      const lectureId = 1;
      const userId = 1;
      const numberOfRequests = 5;

      await Promise.all(
        Array.from({ length: numberOfRequests }).map(() => {
          return request(server).post('/enrollments').send({
            lectureId,
            userId,
          });
        }),
      );

      // 유저의 수강 신청 목록 조회
      const result = await request(server)
        .get(`/enrollments?userId=${userId}&status=ENROLLED`)
        .expect(200);

      expect(result.body.enrollments.length).toBe(1);
    });
  });

  describe('/enrollments (POST)', () => {
    it('동시에 동일한 특강에 대해 40명이 신청했을 때, 30명만 성공해야 한다.', async () => {
      const lectureId = 2;
      const numberOfRequests = 40;

      for (let i = 0; i < numberOfRequests; i++) {
        const result = await request(server)
          .post('/enrollments')
          .send({
            lectureId,
            userId: i + 1,
          });
        if (i < 30) {
          expect(result.status).toBe(201);
        } else {
          expect(result.status).toBe(500);
        }
      }
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
