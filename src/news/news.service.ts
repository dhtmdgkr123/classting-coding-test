import { Injectable } from '@nestjs/common';

import { NewsRepository } from '@/news/news.repository';
import { SchoolRepository } from '@/school/school.repository';

import { OkResource } from '@/libs/resource/ok.resource';
import { PublishNewsVo, DeleteNewsVo, EditNewsVo } from '@/news/vos';
import { Prisma, news } from '@prisma/client';
import { UnprocessableEntityException } from '@/libs/error/exceptions/unprocessable-entity.exception';
import { SubscriptionRepository } from '@/subscribe/subscription.repository';
import { NewsFeedRepository } from '@/news-feed/news-feed.repository';
import dayjs from 'dayjs';

@Injectable()
export class NewsService {
  constructor(
    private readonly schoolRepository: SchoolRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly newsRepository: NewsRepository,
    private readonly newFeedRepository: NewsFeedRepository,
  ) {}

  public async publish(createNewsData: PublishNewsVo) {
    await this.getSchoolById(createNewsData.schoolId);

    const publishedNews = await this.newsRepository.create(createNewsData);

    const subscribers = await this.subscriptionRepository.findBySchoolId(
      createNewsData.schoolId,
    );

    const newsFeeds = await this.newFeedRepository.createMany(
      subscribers.map((subscriber): Prisma.news_feedsCreateManyInput => {
        return {
          created_at: dayjs().add(9, 'hour').toDate(),
          student_id: subscriber.student_id,
          news_id: publishedNews.id,
        };
      }),
    );

    return new OkResource({
      ok: publishedNews && newsFeeds ? true : false,
    });
  }

  public async delete(deleteNewsData: DeleteNewsVo) {
    await this.getSchoolById(deleteNewsData.schoolId);

    const news = await this.newsRepository.findByIdAndSchoolId(
      deleteNewsData.newsId,
      deleteNewsData.schoolId,
    );
    this.validateNews(news);

    const deleteResult = await this.newsRepository.delete(
      deleteNewsData.newsId,
      deleteNewsData.schoolId,
    );

    return new OkResource({
      ok: deleteResult ? true : false,
    });
  }

  public async edit(editNewsData: EditNewsVo) {
    await this.getSchoolById(editNewsData.schoolId);

    const news = await this.newsRepository.findByIdAndSchoolId(
      editNewsData.newsId,
      editNewsData.schoolId,
    );

    this.validateNews(news);

    const editResult = await this.newsRepository.update(
      editNewsData.newsId,
      editNewsData.schoolId,
      {
        content: editNewsData.content,
      },
    );

    return new OkResource({
      ok: editResult ? true : false,
    });
  }

  private async getSchoolById(schoolId: number) {
    const schoolNotFoundException = new UnprocessableEntityException([
      '존재하지 않는 학교 입니다.',
    ]);
    if (Number.isNaN(schoolId)) {
      throw schoolNotFoundException;
    }
    const school = await this.schoolRepository.findById(schoolId);

    if (!school) {
      throw schoolNotFoundException;
    }
    return school;
  }

  private validateNews(news: news | null) {
    if (!news) {
      throw new UnprocessableEntityException(['존재하지 않는 뉴스 입니다.']);
    }

    if (news.deleted_at) {
      throw new UnprocessableEntityException(['이미 삭제된 뉴스 입니다.']);
    }
  }
}
