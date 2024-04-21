import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { appBase, randomIntByRange } from 'test/test.base';
import request from 'supertest';
import dayjs from 'dayjs';
import { createSchool, createStudent } from './base';

describe('학생이 구독중인 특정 학교의 최신소식을 조회할 수 있다. (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeEach(async () => {
    app = await appBase();
    if (!prisma) {
      prisma = new PrismaClient();
    }
    await app.init();
  });

  afterEach(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('학생은 구독한 모든 여러 학교의 최신 소식을 조회할 수 있다.', async () => {
    const schools = await Promise.all(
      Array.from({ length: 3 }, () => createSchool(prisma)),
    );
    const student = await createStudent(prisma);

    const createResult = await prisma.news.createMany({
      data: Array.from({ length: 10 }, (_, i) => {
        return {
          content: '소식 내용-' + i,
          school_id: schools[randomIntByRange(0, 2)].id,
          created_at: dayjs().add(9, 'hours').subtract(i, 'day').toDate(),
          updated_at: dayjs().add(9, 'hours').subtract(i, 'day').toDate(),
        };
      }),
    });

    await prisma.subscriptions.createMany({
      data: schools.map((s) => {
        return {
          student_id: student.id,
          school_id: s.id,
          subscribe_at: dayjs().add(9, 'hours').toDate(),
        };
      }),
    });

    const news = await prisma.news.findMany({
      where: {
        school_id: {
          in: schools.map((s) => Number(s.id)),
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    await prisma.news_feeds.createMany({
      data: news.map((n) => {
        return {
          student_id: student.id,
          news_id: n.id,
        };
      }),
    });

    const response = await request(app.getHttpServer())
      .get(`/students/${student.id}/news-feeds`)
      .expect(200);

    expect(response.body.length).toBe(createResult.count);

    news.forEach((n, i) => {
      expect(response.body[i].content).toBe(n.content);
      expect(response.body[i].school.id).toBe(Number(n.school_id));
    });
  });

  it('학생은 구독후 특정 학교를 구독취소 하고, 구독취소 이전, 시점부터 현 시점까지 모든 여러 학교의 최신 소식을 조회할 수 있다.', async () => {
    const schools = await Promise.all(
      Array.from({ length: 3 }, () => createSchool(prisma)),
    );
    const student = await createStudent(prisma);

    const createResult = await prisma.news.createMany({
      data: Array.from({ length: 10 }, (_, i) => {
        return {
          content: '소식 내용-' + i,
          school_id: schools[randomIntByRange(0, 2)].id,
          created_at: dayjs().add(9, 'hours').toDate(),
          updated_at: dayjs().add(9, 'hours').toDate(),
        };
      }),
    });

    const unsubscribeSchoolId = Number(schools[randomIntByRange(0, 2)].id);

    await prisma.subscriptions.createMany({
      data: schools.map((s) => {
        const now = dayjs().add(9, 'hours');
        return {
          student_id: student.id,
          school_id: s.id,
          ...(Number(s.id) === unsubscribeSchoolId
            ? { subscribe_at: now.toDate() }
            : { unsubscribe_at: now.subtract(1, 'day').toDate() }),
          created_at: dayjs().add(9, 'hours').toDate(),
          updated_at: dayjs().add(9, 'hours').toDate(),
        };
      }),
    });

    const news = await prisma.news.findMany({
      where: {
        school_id: {
          in: schools.map((s) => Number(s.id)),
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    await prisma.news_feeds.createMany({
      data: news.map((n) => {
        return {
          student_id: student.id,
          news_id: n.id,
        };
      }),
    });

    const response = await request(app.getHttpServer())
      .get(`/students/${student.id}/news-feeds`)
      .expect(200);

    expect(response.body.length).toBe(createResult.count);

    news.forEach((n, i) => {
      expect(response.body[i].content).toBe(n.content);
      expect(response.body[i].school.id).toBe(Number(n.school_id));
    });
  });

  it('학교의 소식이 하나도 없는 경우 학생이 구독한 학교의 최신 소식을 조회.', async () => {
    // given
    const school = await createSchool(prisma);
    const student = await createStudent(prisma);

    await prisma.subscriptions.create({
      data: {
        student_id: student.id,
        school_id: school.id,
        subscribe_at: dayjs().add(9, 'hours').toDate(),
      },
    });

    // when
    const response = await request(app.getHttpServer())
      .get(`/students/${student.id}/news-feeds`)
      .send()
      .expect(200);

    // expect
    expect(response.body).toEqual([]);
  });

  it('존재하지 않은 학생이 구독한 학교 최신 소식 조회를 실패 합니다.', async () => {
    // given
    // none

    // when
    const response = await request(app.getHttpServer())
      .get(`/students/-1/news-feeds`)
      .send()
      .expect(422);

    // expect
    expect(response.body.messages).toEqual(['존재하지 않는 학생 입니다.']);
  });
});
