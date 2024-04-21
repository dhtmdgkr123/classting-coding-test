import { PrismaService } from '@/libs/database/prisma.service';
import { Module } from '@nestjs/common';
import { StudentService } from '@/student/student.service';
import { StudentRepository } from '@/student/student.repository';
import { StudentController } from '@/student/student.controller';
import { SchoolModule } from '@/school/school.module';
import { SubscribeModule } from '@/subscribe/subscribe.module';
import { NewsModule } from '@/news/news.module';
import { NewsFeedModule } from '@/news-feed/news-feed.module';

@Module({
  imports: [SchoolModule, SubscribeModule, NewsModule, NewsFeedModule],
  controllers: [StudentController],
  providers: [PrismaService, StudentService, StudentRepository],
})
export class StudentModule {}
