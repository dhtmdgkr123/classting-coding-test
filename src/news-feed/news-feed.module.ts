import { Module } from '@nestjs/common';
import { NewsFeedRepository } from '@/news-feed/news-feed.repository';
import { PrismaService } from '@/libs/database/prisma.service';

@Module({
  providers: [PrismaService, NewsFeedRepository],
  exports: [NewsFeedRepository],
})
export class NewsFeedModule {}
