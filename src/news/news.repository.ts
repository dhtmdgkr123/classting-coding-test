import { PrismaService } from '@/libs/database/prisma.service';
import { PublishNewsVo } from '@/news/vos/request/publish-news.vo';
import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { Prisma } from '@prisma/client';

@Injectable()
export class NewsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async findByIdAndSchoolId(newsId: number, schoolId: number) {
    return this.prismaService.news.findFirst({
      where: {
        id: newsId,
        school_id: schoolId,
        deleted_at: null,
      },
    });
  }

  public async findBySchoolIds(schoolId: number[]) {
    return this.prismaService.news.findMany({
      where: {
        // school_id: schoolId,
        school_id: {
          in: schoolId,
        },
        deleted_at: null,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  public async findBySchoolId(schoolId: number) {
    return this.prismaService.news.findMany({
      where: {
        school_id: schoolId,
        deleted_at: null,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  public async findByIds(ids: number[]) {
    return this.prismaService.news.findMany({
      where: {
        id: {
          in: ids,
        },
        deleted_at: null,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  public async create(createNewsData: PublishNewsVo) {
    return this.prismaService.news.create({
      data: {
        school_id: createNewsData.schoolId,
        content: createNewsData.content,
        created_at: dayjs().add(9, 'hour').toDate(),
        updated_at: dayjs().add(9, 'hour').toDate(),
      },
    });
  }

  public async update(
    newsId: number,
    schoolId: number,
    data: Prisma.newsUpdateInput,
  ) {
    return this.prismaService.news.update({
      where: {
        id: newsId,
        school_id: schoolId,
      },
      data: {
        ...data,
        updated_at: dayjs().add(9, 'hour').toDate(),
      },
    });
  }

  public async delete(newsId: number, schoolId: number) {
    return this.prismaService.news.update({
      where: {
        id: newsId,
        school_id: schoolId,
      },
      data: {
        deleted_at: dayjs().add(9, 'hour').toDate(),
      },
    });
  }
}
