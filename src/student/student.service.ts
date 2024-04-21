import { HttpStatus, Injectable } from '@nestjs/common';
import {
  SubscribeSchoolVo,
  UnSubScribeVo,
  InquirySchoolVo,
  SubscriptionVo,
  InquiryNewsVo,
  SchoolVo,
  InquiryNewsFeedsVo,
} from '@/student/vos';
import { NewsVo } from '@/news/vos/response/news.vo';
import { SubscriptionRepository } from '@/subscribe/subscription.repository';
import { StudentRepository } from '@/student/student.repository';
import { UnprocessableEntityException } from '@/libs/error/exceptions/unprocessable-entity.exception';
import { SchoolRepository } from '@/school/school.repository';
import { OkResource } from '@/libs/resource/ok.resource';
import dayjs from 'dayjs';
import { Exception } from '@/libs/error/exceptions/exception';
import { NewsRepository } from '@/news/news.repository';
import { NewsFeedRepository } from '@/news-feed/news-feed.repository';

@Injectable()
export class StudentService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly studentRepository: StudentRepository,
    private readonly schoolRepository: SchoolRepository,
    private readonly newsRepository: NewsRepository,
    private readonly newsFeedRepository: NewsFeedRepository,
  ) {}

  /**
   * 학교 PK로 학교를 찾습니다.
   * @throws UnprocessableEntityException
   * @param id number
   * @returns school school
   */
  private async findSchoolById(id: number) {
    const school = await this.schoolRepository.findById(id);
    if (!school) {
      throw new UnprocessableEntityException(['존재하지 않는 학교 입니다.']);
    }
    return school;
  }

  /**
   * 학생 PK로 학생을 찾습니다.
   * @param id number
   * @returns student
   */
  private async findStudentById(id: number) {
    const student = await this.studentRepository.findById(id);
    if (!student) {
      throw new UnprocessableEntityException(['존재하지 않는 학생 입니다.']);
    }
    return student;
  }

  /**
   * 학생이 학교 페이지를 구독 합니다.
   * @param subscribeSchool SubscribeSchoolVo
   * @throws UnprocessableEntityException
   * @returns okResource OkResource
   */
  public async subscribe(subscribeSchool: SubscribeSchoolVo) {
    await this.findStudentById(Number(subscribeSchool.studentId));
    await this.findSchoolById(Number(subscribeSchool.schoolId));

    const subscription =
      await this.subscriptionRepository.findByStudentIdAndSchoolId(
        Number(subscribeSchool.studentId),
        Number(subscribeSchool.schoolId),
      );
    if (subscription && subscription.unsubscribe_at === null) {
      throw new UnprocessableEntityException(['이미 구독한 학교 입니다.']);
    }

    let subscribeResult = null;

    if (subscription && subscription.unsubscribe_at) {
      /**
       * 구독을 취소한 경우 다시 구독 처리
       */
      subscribeResult = await this.subscriptionRepository.update(
        Number(subscribeSchool.studentId),
        Number(subscribeSchool.schoolId),
        {
          subscribe_at: dayjs().add(9, 'hour').toDate(),
          unsubscribe_at: null,
        },
      );
    } else {
      /**
       * 구독한 적이 없는 경우 신규 구독 처리
       */
      subscribeResult = await this.subscriptionRepository.create(
        Number(subscribeSchool.studentId),
        Number(subscribeSchool.schoolId),
      );
    }

    return new OkResource({
      ok: subscribeResult ? true : false,
    });
  }

  /**
   * 학생이 학교 페이지를 구독을 취소 합니다.
   *
   * @param unsubscribeSchool UnSubScribeVo
   * @throws UnprocessableEntityException
   * @returns okResource OkResource
   */
  public async unsubscribe(unsubscribeSchool: UnSubScribeVo) {
    await this.findStudentById(Number(unsubscribeSchool.studentId));
    await this.findSchoolById(Number(unsubscribeSchool.schoolId));

    const subscription =
      await this.subscriptionRepository.findByStudentIdAndSchoolId(
        Number(unsubscribeSchool.studentId),
        Number(unsubscribeSchool.schoolId),
      );

    const canUnsubscribe = subscription && subscription.unsubscribe_at === null;

    if (!canUnsubscribe) {
      throw new UnprocessableEntityException([
        '해당 학교는 구독하지 않았습니다.',
      ]);
    }

    const unsubscribeResult = await this.subscriptionRepository.update(
      Number(unsubscribeSchool.studentId),
      Number(unsubscribeSchool.schoolId),
      {
        subscribe_at: null,
        unsubscribe_at: dayjs().add(9, 'hour').toDate(),
      },
    );

    return new OkResource({
      ok: unsubscribeResult ? true : false,
    });
  }

  /**
   * 학생이 구독 중인 학교 페이지 목록을 확인 합니다.
   * @param inquiryData InquirySchoolVo
   * @returns subscriptions SubscriptionVo[]
   */
  public async getSubscriptions(inquiryData: InquirySchoolVo) {
    await this.findStudentById(Number(inquiryData.studentId));
    const subscriptions =
      await this.subscriptionRepository.findSubscribedByStudent(
        Number(inquiryData.studentId),
      );
    const schoolIds = subscriptions.map((subscription) =>
      Number(subscription.school_id),
    );
    const schools = await this.schoolRepository.findByIds(schoolIds);

    return subscriptions.map((subscription) => {
      const school = schools.find(
        (school) => school.id === subscription.school_id,
      );
      if (!school) {
        throw new Exception(
          ['올바르지 않은 데이터 입니다.'],
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return new SubscriptionVo({
        id: Number(subscription.id),
        subscribeAt: subscription.subscribe_at ?? new Date(),
        school: new SchoolVo({
          id: Number(school.id),
          name: school.name,
          region: school.region,
        }),
      });
    });
  }

  /**
   * 학생이 구독중인 특정 학교의 소식을 조회 힙니다.
   * @param inquiryNews InquiryNewsVo
   * @throws UnprocessableEntityException
   * @returns news NewsVo[]
   */
  public async getNews(inquiryNews: InquiryNewsVo) {
    await this.findStudentById(Number(inquiryNews.studentId));
    await this.findSchoolById(Number(inquiryNews.schoolId));

    // 구독중인지 확인
    const subscription =
      await this.subscriptionRepository.findByStudentIdAndSchoolId(
        Number(inquiryNews.studentId),
        Number(inquiryNews.schoolId),
      );
    if (!subscription || subscription.unsubscribe_at) {
      throw new UnprocessableEntityException(['구독 중인 학교가 아닙니다.']);
    }

    const news = await this.newsRepository.findBySchoolId(
      Number(inquiryNews.schoolId),
    );

    const schools = await this.schoolRepository.findByIds([
      ...new Set(news.map((news) => Number(news.school_id))),
    ]);

    return news.map((news) => {
      const school = schools.find(
        (school) => school.id === subscription.school_id,
      );
      if (!school) {
        throw new Exception(
          ['올바르지 않은 데이터 입니다.'],
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return new NewsVo({
        id: Number(news.id),
        content: news.content,
        school: new SchoolVo({
          id: Number(school.id),
          name: school.name,
          region: school.region,
        }),
        createdAt: news.created_at,
      });
    });
  }

  /**
   * 학생이 구독 중인 학교 소식을 뉴스 최신 순 으로 자신의 뉴스피드에서 모아볼 수 있습니다.
   * @param inquiryNewsFeeds InquiryNewsFeedsVo
   * @returns news NewsVo[]
   */
  public async getNewsFeeds(inquiryNewsFeeds: InquiryNewsFeedsVo) {
    await this.findStudentById(Number(inquiryNewsFeeds.studentId));

    const feeds = await this.newsFeedRepository.findByStudentId(
      Number(inquiryNewsFeeds.studentId),
    );

    const newsIds = feeds.map((feed) => Number(feed.news_id));

    const news = await this.newsRepository.findByIds(newsIds);

    const schools = await this.schoolRepository.findByIds([
      ...new Set(news.map((news) => Number(news.school_id))),
    ]);

    return news.map((news) => {
      const school = schools.find((school) => school.id === news.school_id);
      if (!school) {
        throw new Exception(
          ['올바르지 않은 데이터 입니다.'],
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return new NewsVo({
        id: Number(news.id),
        content: news.content,
        school: new SchoolVo({
          id: Number(school.id),
          name: school.name,
          region: school.region,
        }),
        createdAt: news.created_at,
      });
    });
  }
}
