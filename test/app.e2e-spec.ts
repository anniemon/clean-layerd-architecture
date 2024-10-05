import { DataSource } from 'typeorm';
import { Test } from '@nestjs/testing';
import { setInitialData } from '../src/infrastructure/typeorm/helper/seed';
// import * as entities from '../src/infrastructure/typeorm/entities';
import dataSource from '../src/infrastructure/typeorm/data-source';
import request from 'supertest';
import { AppModule } from '../src/infrastructure/modules/app.module';
import { INestApplication } from '@nestjs/common';
import { fixtures } from '../src/infrastructure/typeorm/helper/fixtures';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Enrollment', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/enrollments (POST)', () => {
    it('should return 201', async () => {
      return await request(app.getHttpServer())
        .post('/enrollments')
        .send({
          lectureId: fixtures.lecture[0].id,
          userId: fixtures.user[0].id,
        })
        .expect(201);
    });
  });

  /**
   * 신청한 특강 조회
   */
  describe('/enrollments (GET)', () => {
    it('should return 200', async () => {
      return await request(app.getHttpServer())
        .get(`/enrollments?userId=${fixtures.user[0].id}&status=ENROLLED`)
        .expect(200);
    });
  });
  /**
   * 날짜별로 현재 신청 가능한 특강 목록 조회
   */
  describe('/lectures (GET)', () => {
    it('should return 200', async () => {
      return await request(app.getHttpServer())
        .get(`/lectures/available?date=${fixtures.lecture[0].date}`)
        .expect(200);
    });
  });
  /**
   * 동일한 유저 정보로 같은 특강을 5번 신청했을 때, 1번만 성공해야 한다.
   */
  describe('/enrollments (POST)', () => {
    it('동일한 유저 정보로 같은 특강을 5번 신청했을 때, 1번만 성공해야 한다.', async () => {
      const lectureId = 1;
      const userId = 1;
      const numberOfRequests = 5;

      const results = await Promise.all(
        Array.from({ length: numberOfRequests }).map(() => {
          return request(app.getHttpServer()).post('/enrollments').send({
            lectureId,
            userId,
          });
        }),
      );

      const successResponses = results.filter(
        (response) => response.status === 201,
      );
      const failedResponses = results.filter((response) => {
        return response.status === 400;
      });

      expect(successResponses.length).toBe(1);
      expect(failedResponses.length).toBe(4);
    });
  });

  /**
   - 동시에 동일한 특강에 대해 40명이 신청했을 때, 30명만 성공해야 한다.
   */
  describe('/enrollments (POST)', () => {
    it('동시에 동일한 특강에 대해 40명이 신청했을 때, 30명만 성공해야 한다.', async () => {
      const lectureId = 1; // 테스트할 특강 ID
      const numberOfRequests = 40; // 40명의 사용자가 동시에 요청

      const results = await Promise.all(
        Array.from({ length: numberOfRequests }).map((_, index) => {
          return request(app.getHttpServer())
            .post('/enrollments')
            .send({
              lectureId,
              userId: index + 1,
            });
        }),
      );
      console.log(results, 'results');
      // 성공한 요청과 실패한 요청을 나눔
      const successResponses = results.filter(
        (response) => response.status === 201,
      );
      const failedResponses = results.filter((response) => {
        return response.status === 400;
      }); // 400 또는 409 오류 처리
      console.log(successResponses, 'successResponses');
      console.log(failedResponses, 'failedResponses');
      // 성공한 요청이 정확히 30개여야 함
      // expect(successResponses.length).toBe(30);
      // 실패한 요청이 정확히 10개여야 함
      // expect(failedResponses.length).toBe(10);
      // 신청 가능 특강 목록에 lectureId에 해당하는 특강이 없어야 함
      const availableLectures = await request(app.getHttpServer()).get(
        `/lectures/available?date=${fixtures.lecture[0].date}`,
      );
      console.log(availableLectures.body, 'availableLectures.body');
      expect(availableLectures.body).not.toContainEqual(
        expect.objectContaining({
          id: lectureId,
        }),
      );
    });
  });
  /** - 동일한 신청자는 동일한 강의에 대해서 한 번의 수강 신청만 성공할 수 있습니다.
- - 동시에 동일한 특강에 대해 40명이 신청했을 때, 30명만 성공하는 것을 검증하는 **통합 테스트** 작성
- 동일한 유저 정보로 같은 특강을 5번 신청했을 때, 1번만 성공하는 것을 검증하는 **통합 테스트** 작성
   */
  /**
   * - 날짜별로 현재 신청 가능한 특강 목록을 조회하는 API 를 작성합니다.
   */

  /**
   * - 특정 userId 로 신청 완료된 특강 목록을 조회하는 API 를 작성합니다.
- 각 항목은 특강 ID 및 이름, 강연자 정보를 담고 있어야 합니다.
   */

  afterAll(async () => {
    await app.close();
  });
});
