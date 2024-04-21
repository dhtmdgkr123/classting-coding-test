import { PrismaService } from '@/libs/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';

@Injectable()
export class SubscriptionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async findByStudentIdAndSchoolId(studentId: number, schoolId: number) {
    return this.prismaService.subscriptions.findFirst({
      where: {
        student_id: studentId,
        school_id: schoolId,
      },
    });
  }

  public async findSubscribedByStudent(studentId: number) {
    return this.prismaService.subscriptions.findMany({
      where: {
        student_id: studentId,
        subscribe_at: {
          not: null,
        },
        unsubscribe_at: null,
      },
    });
  }

  public async findBySchoolId(schoolId: number) {
    return this.prismaService.subscriptions.findMany({
      where: {
        school_id: schoolId,
        subscribe_at: {
          not: null,
        },
        unsubscribe_at: null,
      },
    });
  }

  public async update(
    studentId: number,
    schoolId: number,
    data: Prisma.subscriptionsUpdateManyMutationInput,
  ) {
    const now = dayjs().add(9, 'hour').toDate();

    return this.prismaService.subscriptions.updateMany({
      where: {
        student_id: studentId,
        school_id: schoolId,
      },
      data: { ...data, updated_at: now },
    });
  }

  public async create(studentId: number, schoolId: number) {
    const now = dayjs().add(9, 'hour').toDate();

    return this.prismaService.subscriptions.create({
      data: {
        student_id: studentId,
        school_id: schoolId,
        created_at: now,
        updated_at: now,
        subscribe_at: now,
      },
    });
  }
}
