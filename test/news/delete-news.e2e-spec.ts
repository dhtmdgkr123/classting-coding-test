import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { appBase } from 'test/test.base';
import request from 'supertest';
// import dayjs from 'dayjs';
import { createSchool, createStudent } from 'test/student/base';
import dayjs from 'dayjs';

describe('관리자가 발행한 뉴스를 삭제 합니다. (e2e)', () => {
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

  it('관리자가 발행한 뉴스를 삭제 합니다.', async () => {
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
    const news = await prisma.news.create({
      data: {
        school_id: school.id,
        content: '내용',
        created_at: dayjs().add(9, 'hour').toDate(),
        updated_at: dayjs().add(9, 'hour').toDate(),
      },
    });
    await prisma.news_feeds.create({
      data: {
        news_id: news.id,
        student_id: subscription.student_id,
        created_at: dayjs().add(9, 'hour').toDate(),
      },
    });

    // when
    const response = await request(app.getHttpServer())
      .delete(`/schools/${school.id}/news/${news.id}`)
      .send()
      .expect(200);
    // then
    const deletedNews = await prisma.news.findMany({
      where: {
        id: news.id,
      },
    });
    expect(response.body.ok).toBeTruthy();
    expect(deletedNews[0].deleted_at).not.toBeNull();
  });

  it('존재하지 않는 학교에 발행된 뉴스를 삭제 시도 후 실패 합니다.', async () => {
    // given
    // none

    // when
    const response = await request(app.getHttpServer())
      .delete(`/schools/-1/news/-1`)
      .send()
      .expect(422);

    // then
    expect(response.body.messages).toEqual(['존재하지 않는 학교 입니다.']);
  });

  it('존재하지 않는 뉴스를 삭제 시도 후 실패 합니다.', async () => {
    if (!prisma) {
      throw new Error('prisma is not initialized');
    }
    // given
    const school = await createSchool(prisma);

    // when
    const response = await request(app.getHttpServer())
      .delete(`/schools/${school.id}/news/-1`)
      .send()
      .expect(422);

    // then
    expect(response.body.messages).toEqual(['존재하지 않는 뉴스 입니다.']);
  });

  it('이미 삭제된 뉴스를 삭제하려고 시도 하여 수정에 실패 합니다', async () => {
    if (!prisma) {
      throw new Error('prisma is not initialized');
    }
    // given
    const school = await createSchool(prisma);
    const news = await prisma.news.create({
      data: {
        school_id: school.id,
        content: '내용',
        created_at: dayjs().add(9, 'hour').toDate(),
        updated_at: dayjs().add(9, 'hour').toDate(),
        deleted_at: dayjs().add(9, 'hour').add(1, 'day').toDate(),
      },
    });

    // when
    const response = await request(app.getHttpServer())
      .delete(`/schools/${school.id}/news/${news.id}`)
      .send()
      .expect(422);

    // then
    expect(response.body.messages).toEqual(['존재하지 않는 뉴스 입니다.']);
  });

  it('학교서 발행된 뉴스가 아닌 다른 뉴스 삭제를 시도 합니다', async () => {
    if (!prisma) {
      throw new Error('prisma is not initialized');
    }
    // given
    const school = await createSchool(prisma);
    const school2 = await createSchool(prisma);
    const news = await prisma.news.create({
      data: {
        school_id: school.id,
        content: '내용',
        created_at: dayjs().add(9, 'hour').toDate(),
        updated_at: dayjs().add(9, 'hour').toDate(),
      },
    });

    // when
    const response = await request(app.getHttpServer())
      .delete(`/schools/${school2.id}/news/${news.id}`)
      .send()
      .expect(422);

    // then
    expect(response.body.messages).toEqual(['존재하지 않는 뉴스 입니다.']);
  });
});
