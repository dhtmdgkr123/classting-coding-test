import { Module } from '@nestjs/common';
import { SchoolController } from '@/school/school.controller';
import { SchoolService } from '@/school/school.service';
import { PrismaService } from '@/libs/database/prisma.service';
import { SchoolRepository } from '@/school/school.repository';

@Module({
  controllers: [SchoolController],
  providers: [PrismaService, SchoolService, SchoolRepository],
  exports: [SchoolRepository],
})
export class SchoolModule {}
