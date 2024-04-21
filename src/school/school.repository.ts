import { PrismaService } from '@/libs/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateSchoolVo } from '@/school/vos';
import dayjs from 'dayjs';

@Injectable()
export class SchoolRepository {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * 학교 이름으로 학교를 찾습니다.
   * @param name string
   * @returns school
   */
  public async findByName(name: string) {
    return await this.prismaService.schools.findMany({
      where: {
        name,
      },
    });
  }

  /**
   * PK로 학교를 찾습니다.
   * @param id number
   * @returns school
   */
  public async findById(id: number) {
    return await this.prismaService.schools.findUnique({
      where: {
        id,
      },
    });
  }

  /**
   * PK들 로 학교를 찾습니다.
   * @param ids number[]
   * @returns school
   */
  public async findByIds(ids: number[]) {
    return await this.prismaService.schools.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  /**
   * 학교 페이지를 생성 합니다
   * @param CreateSchoolVo createSchoolData
   * @returns school
   */
  public async create(createSchoolData: CreateSchoolVo) {
    return await this.prismaService.schools.create({
      data: {
        name: createSchoolData.name,
        region: createSchoolData.region,
        created_at: dayjs().add(9, 'hour').toDate(),
        updated_at: dayjs().add(9, 'hour').toDate(),
      },
    });
  }
}
