import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { appBase } from 'test/test.base';
import request from 'supertest';
import dayjs from 'dayjs';
import { createSchool, createStudent } from './base';

describe('학생이 학교 페이지를 구독 취소 합니다. (e2e)', () => {
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

  it('이미 구독한 취소 학교를 다시 구독 취소 할 수 없습니다.', async () => {
    // given
    if (!prisma) {
      throw new Error('prisma is not initialized');
    }
    const school = await createSchool(prisma);
    const student = await createStudent(prisma);

    await prisma.subscriptions.create({
      data: {
        student_id: student.id,
        school_id: school.id,
        subscribe_at: null,
        unsubscribe_at: dayjs().add(9, 'hour').toDate(),
        created_at: dayjs().add(9, 'hours').toDate(),
        updated_at: dayjs().add(9, 'hours').toDate(),
      },
    });
    // when
    const response = await request(app.getHttpServer())
      .delete(`/students/${student.id}/subscriptions/${school.id}`)
      .send()
      .expect(422);

    // then
    expect(response.body.messages).toEqual([
      '해당 학교는 구독하지 않았습니다.',
    ]);
  });

  it('학생이 학교를 최초 구독 취소를 성공적으로 합니다.', async () => {
    // given
    if (!prisma) {
      throw new Error('prisma is not initialized');
    }
    const school = await createSchool(prisma);
    const student = await createStudent(prisma);

    await prisma.subscriptions.create({
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
      .delete(`/students/${student.id}/subscriptions/${school.id}`)
      .send()
      .expect(200);

    // then
    expect(response.body.ok).toBeTruthy();

    const subscription = await prisma.subscriptions.findFirst({
      where: {
        student_id: student.id,
        school_id: school.id,
      },
    });
    expect(subscription).not.toBeNull();
    expect(subscription?.subscribe_at).toBeNull();
    expect(subscription?.unsubscribe_at).not.toBeNull();
  });

  it('구독을 하지 않은 상태에서 구독 취소를 실패 합니다.', async () => {
    // given
    if (!prisma) {
      throw new Error('prisma is not initialized');
    }
    const school = await createSchool(prisma);
    const student = await createStudent(prisma);

    // when
    const response = await request(app.getHttpServer())
      .delete(`/students/${student.id}/subscriptions/${school.id}`)
      .send()
      .expect(422);

    // then
    expect(response.body.messages).toEqual([
      '해당 학교는 구독하지 않았습니다.',
    ]);
  });

  it('존재하지 않는 학교를 구독 취소 할 수 없습니다.', async () => {
    // given
    if (!prisma) {
      throw new Error('prisma is not initialized');
    }
    const student = await createStudent(prisma);

    // when
    const response = await request(app.getHttpServer())
      .delete(`/students/${student.id}/subscriptions/-1`)
      .send()
      .expect(422);

    // then
    expect(response.body.messages).toEqual(['존재하지 않는 학교 입니다.']);
  });

  it('존재하지 않는 학생은 구독 취소 할 수 없습니다.', async () => {
    // given
    if (!prisma) {
      throw new Error('prisma is not initialized');
    }
    const school = await createSchool(prisma);

    // when
    const response = await request(app.getHttpServer())
      .delete(`/students/-1/subscriptions/${school.id}`)
      .send()
      .expect(422);

    // then
    expect(response.body.messages).toEqual(['존재하지 않는 학생 입니다.']);
  });
});
