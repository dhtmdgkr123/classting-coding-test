import { Module } from '@nestjs/common';
import { SchoolModule } from '@/school/school.module';
import { NewsModule } from '@/news/news.module';
import { StudentModule } from '@/student/student.module';
import { SubscribeModule } from '@/subscribe/subscribe.module';

@Module({
  imports: [SubscribeModule, SchoolModule, NewsModule, StudentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
