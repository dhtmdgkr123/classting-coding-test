import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { appBase } from 'test/test.base';
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

  it('학생은 구독한 학교의 최신 소식을 조회할 수 있다.', async () => {
    const school = await createSchool(prisma);
    const student = await createStudent(prisma);

    const createResult = await prisma.news.createMany({
      data: Array.from({ length: 10 }, (_, i) => {
        return {
          content: '소식 내용-' + i,
          school_id: school.id,
          created_at: dayjs().add(9, 'hours').subtract(i, 'day').toDate(),
          updated_at: dayjs().add(9, 'hours').subtract(i, 'day').toDate(),
        };
      }),
    });

    await prisma.subscriptions.create({
      data: {
        student_id: student.id,
        school_id: school.id,
        subscribe_at: dayjs().add(9, 'hours').toDate(),
        created_at: dayjs().add(9, 'hours').toDate(),
        updated_at: dayjs().add(9, 'hours').toDate(),
      },
    });

    const news = await prisma.news.findMany({
      where: {
        school_id: school.id,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const response = await request(app.getHttpServer())
      .get(`/students/${student.id}/subscriptions/${school.id}/news`)
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
        created_at: dayjs().add(9, 'hours').toDate(),
        updated_at: dayjs().add(9, 'hours').toDate(),
      },
    });
    // when
    const response = await request(app.getHttpServer())
      .get(`/students/${student.id}/subscriptions/${school.id}/news`)
      .send()
      .expect(200);

    // expect
    expect(response.body).toEqual([]);
  });

  it('존재하지 않은 학생이 구독한 학교 최신 소식 조회를 실패 합니다.', async () => {
    // given
    const school = await createSchool(prisma);

    // when
    const response = await request(app.getHttpServer())
      .get(`/students/-1/subscriptions/${school.id}/news`)
      .send()
      .expect(422);

    // expect
    expect(response.body.messages).toEqual(['존재하지 않는 학생 입니다.']);
  });

  it('학생이 구독한 존재하지 않는 학교 페이지 리스트 조회를 실패 합니다.', async () => {
    // given
    const student = await createStudent(prisma);

    // when
    const response = await request(app.getHttpServer())
      .get(`/students/${student.id}/subscriptions/-1/news`)
      .send()
      .expect(422);

    // expect
    expect(response.body.messages).toEqual(['존재하지 않는 학교 입니다.']);
  });
});
