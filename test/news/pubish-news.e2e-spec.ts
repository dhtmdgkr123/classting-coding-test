import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { appBase } from 'test/test.base';
import request from 'supertest';
// import dayjs from 'dayjs';
import { createSchool, createStudent } from 'test/student/base';
import dayjs from 'dayjs';

describe('관리자가 뉴스를 발행 합니다. (e2e)', () => {
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

  it('관리자가 뉴스를 발행 합니다.', async () => {
    if (!prisma) {
      throw new Error('prisma is not initialized');
    }

    // given
    const school = await createSchool(prisma);
    const student = await createStudent(prisma);
    const subscription = await prisma.subscriptions.create({
      data: {
        student_id: student.id,
        school_id: school.id,
        subscribe_at: dayjs().add(9, 'hour').toDate(),
        unsubscribe_at: null,
        created_at: dayjs().add(9, 'hour').toDate(),
        updated_at: dayjs().add(9, 'hour').toDate(),
      },
    });

    // when
    const response = await request(app.getHttpServer())
      .post(`/schools/${school.id}/news`)
      .send({
        content: '내용',
      })
      .expect(201);

    const news = await prisma.news.findMany({
      where: {
        school_id: school.id,
      },
    });
    const newsFeed = await prisma.news_feeds.findMany({
      where: {
        news_id: news[0].id,
      },
    });

    // then
    expect(response.body.ok).toBeTruthy();

    expect(news.length).toBe(1);
    expect(news[0].id).toBe(newsFeed[0].news_id);
    expect(newsFeed[0].student_id).toBe(subscription.student_id);
  });

  it('존재하지 않는 학교에 뉴스를 발행 합니다.', async () => {
    // given
    // none

    // when
    const response = await request(app.getHttpServer())
      .post(`/schools/-1/news`)
      .send({
        content: '내용',
      })
      .expect(422);

    // then
    expect(response.body.messages).toEqual(['존재하지 않는 학교 입니다.']);
  });

  it('뉴스 발행 시 내용이 없는 경우 실패 합니다.', async () => {
    if (!prisma) {
      throw new Error('prisma is not initialized');
    }

    // given
    const school = await createSchool(prisma);

    // when
    const response = await request(app.getHttpServer())
      .post(`/schools/${school.id}/news`)
      .send({
        content: '',
      })
      .expect(422);

    // then
    expect(response.body.messages).toContain(
      '뉴스 내용은 1글자 이상 253글자 이하로 입력해주세요.',
    );
  });
});
