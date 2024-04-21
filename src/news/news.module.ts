import { PrismaService } from '@/libs/database/prisma.service';
import { Module } from '@nestjs/common';
import { NewsService } from '@/news/news.service';
import { NewsRepository } from '@/news/news.repository';
import { NewsController } from '@/news/news.controller';
import { SchoolModule } from '@/school/school.module';
import { SubscribeModule } from '@/subscribe/subscribe.module';
import { NewsFeedModule } from '@/news-feed/news-feed.module';

@Module({
  imports: [SchoolModule, SubscribeModule, NewsFeedModule],
  controllers: [NewsController],
  providers: [PrismaService, NewsService, NewsRepository],
  exports: [NewsRepository],
})
export class NewsModule {}
