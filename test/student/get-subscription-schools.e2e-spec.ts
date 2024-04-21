import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { appBase } from 'test/test.base';
import { createSchool, createStudent } from './base';
import dayjs from 'dayjs';
import request from 'supertest';

describe('학생이 구독한 학교 페이지 리스트들을 조회 합니다. (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient | null;

  beforeEach(async () => {
    app = await appBase();
    if (!prisma) {
      prisma = new PrismaClient();
    }
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    await prisma?.$disconnect();
  });

  it('학생이 구독한 학교 페이지 리스트들을 조회 합니다.', async () => {
    // given
    if (!prisma) {
      throw new Error('prisma is not initialized');
    }
    const school = await createSchool(prisma);
    const student = await createStudent(prisma);

    const subscription = await prisma.subscriptions.create({
      data: {
        student_id: student.id,
        school_id: school.id,
        subscribe_at: dayjs().add(9, 'hour').toDate(),
        unsubscribe_at: null,
        created_at: dayjs().add(9, 'hours').toDate(),
        updated_at: dayjs().add(9, 'hours').toDate(),
      },
    });

    // when
    const response = await request(app.getHttpServer())
      .get(`/students/${student.id}/subscriptions`)
      .send()
      .expect(200);

    // expect
    expect(response.body).toHaveLength(1);
    expect(response.body[0].id).toBe(Number(subscription.id));
    expect(response.body[0].school.id).toBe(Number(school.id));
    expect(dayjs(response.body[0].subscribeAt).toDate()).toStrictEqual(
      dayjs(subscription.subscribe_at).toDate(),
    );
  });

  it('존재하지 않은 학생이 구독한 학교 페이지 리스트 조회를 실패 합니다.', async () => {
    // given
    // none

    // when
    const response = await request(app.getHttpServer())
      .get(`/students/-1/subscriptions`)
      .send()
      .expect(422);

    // expect
    expect(response.body.messages).toEqual(['존재하지 않는 학생 입니다.']);
  });

  it('구독한 학교 페이지가 없는 학생이 구독한 학교 페이지 리스트 조회를 실패 합니다.', async () => {
    // given
    if (!prisma) {
      throw new Error('prisma is not initialized');
    }
    const student = await createStudent(prisma);

    // when
    const response = await request(app.getHttpServer())
      .get(`/students/${student.id}/subscriptions`)
      .send()
      .expect(200);

    // expect
    expect(response.body).toHaveLength(0);
  });

  it('학생이 구독한 학교 페이지 리스트 조회를 실패 합니다.', async () => {
    // given
    if (!prisma) {
      throw new Error('prisma is not initialized');
    }
    const student = await createStudent(prisma);

    // when
    const response = await request(app.getHttpServer())
      .get(`/students/${student.id}/subscriptions`)
      .send()
      .expect(200);

    // expect
    expect(response.body).toHaveLength(0);
  });
});
