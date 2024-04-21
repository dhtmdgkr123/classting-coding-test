import { PrismaService } from '@/libs/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class NewsFeedRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async findByStudentId(studentId: number) {
    return this.prismaService.news_feeds.findMany({
      where: {
        student_id: studentId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  public async createMany(datas: Prisma.news_feedsCreateManyInput[]) {
    return this.prismaService.news_feeds.createMany({
      data: datas,
      skipDuplicates: true,
    });
  }
}
