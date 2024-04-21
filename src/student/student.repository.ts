import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/libs/database/prisma.service';

@Injectable()
export class StudentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async findById(id: number) {
    return this.prismaService.students.findUnique({
      where: {
        id,
      },
    });
  }
}
