import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { appBase } from 'test/test.base';
import request from 'supertest';

describe('학교 페이지를 생성 합니다. (e2e)', () => {
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

  it('학교 페이지를 성공적으로 생성 합니다.', async () => {
    // given
    const createSchoolData = {
      name: (Math.random() + 1).toString(36).substring(7),
      region: '서울',
    };

    // when
    const response = await request(app.getHttpServer())
      .post('/schools')
      .send(createSchoolData)
      .expect(201);

    expect(response.body.id).not.toBeNull();
    const dbSchool = await prisma?.schools.findUnique({
      where: {
        id: response.body.id,
      },
    });
    // then
    expect(response.body.name).toEqual(createSchoolData.name);
    expect(response.body.region).toEqual(createSchoolData.region);

    expect(dbSchool?.name).toEqual(createSchoolData.name);
    expect(dbSchool?.region).toEqual(createSchoolData.region);
  });

  it('해당 지역에 이미 존재하는 학교가 있으면 생성이 불가능 합니다.', async () => {
    // given
    const createSchoolData = {
      name: (Math.random() + 1).toString(36).substring(7),
      region: '서울',
    };

    await prisma?.schools.create({
      data: createSchoolData,
    });

    // when
    const response = await request(app.getHttpServer())
      .post('/schools')
      .send(createSchoolData)
      .expect(422);

    // then
    expect(response.body.messages).toContain(
      '해당 지역에는 이미 존재하는 학교 입니다.',
    );
  });

  it('학교 이름은 문자열로 입력이 되어있지 않는 경우 입니다', async () => {
    // given
    const createSchoolData = {
      name: true,
      region: '서울',
    };

    // when
    const response = await request(app.getHttpServer())
      .post('/schools')
      .send(createSchoolData)
      .expect(422);

    // then
    expect(response.body.messages).toContain(
      '올바른 학교 이름을 입력해주세요.',
    );
  });

  it('학교 이름은 1글자 이상 253글자 이하로 입력해주세요.', async () => {
    // given
    const createSchoolData = {
      name: 'a'.repeat(254),
      region: '서울',
    };

    // when
    const response = await request(app.getHttpServer())
      .post('/schools')
      .send(createSchoolData)
      .expect(422);

    // then
    expect(response.body.messages).toContain(
      '학교 이름은 1글자 이상 253글자 이하로 입력해주세요.',
    );
  });

  it('지역 이름은 문자열로 입력해주세요.', async () => {
    // given
    const createSchoolData = {
      name: (Math.random() + 1).toString(36).substring(7),
      region: true,
    };

    // when
    const response = await request(app.getHttpServer())
      .post('/schools')
      .send(createSchoolData)
      .expect(422);

    // then
    expect(response.body.messages).toContain(
      '올바른 지역 이름을 입력해주세요.',
    );
  });

  it('지역 이름은 1글자 이상 253글자 이하로 입력해주세요.', async () => {
    // given
    const createSchoolData = {
      name: (Math.random() + 1).toString(36).substring(7),
      region: 'a'.repeat(254),
    };

    // when
    const response = await request(app.getHttpServer())
      .post('/schools')
      .send(createSchoolData)
      .expect(422);

    // then
    expect(response.body.messages).toContain(
      '지역 이름은 1글자 이상 253글자 이하로 입력해주세요.',
    );
  });

  it('지역 이름은 서울, 부산, 대구, 인천, 광주, 대전, 울산 중 하나의 지역을 입력해주세요.', async () => {
    // given
    const createSchoolData = {
      name: (Math.random() + 1).toString(36).substring(7),
      region: '제주',
    };

    // when
    const response = await request(app.getHttpServer())
      .post('/schools')
      .send(createSchoolData)
      .expect(422);

    // then
    expect(response.body.messages).toContain(
      '서울,부산,대구,인천,광주,대전,울산 중 하나의 지역을 입력해주세요.',
    );
  });
});
