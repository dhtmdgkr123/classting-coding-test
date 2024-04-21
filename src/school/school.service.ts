import { Injectable } from '@nestjs/common';
import { SchoolRepository } from '@/school/school.repository';
import { CreateSchoolVo, SchoolVo } from '@/school/vos';
import { UnprocessableEntityException } from '@/libs/error/exceptions/unprocessable-entity.exception';

@Injectable()
export class SchoolService {
  constructor(private readonly schoolRepository: SchoolRepository) {}

  /**
   * 학교 페이지를 생성 합니다.
   * @throws UnprocessableEntityException
   * @param CreateSchoolVo createSchoolData
   * @returns School school
   */
  public async create(createSchoolData: CreateSchoolVo) {
    const school = (
      await this.schoolRepository.findByName(createSchoolData.name)
    ).find((school) => {
      return school.region === createSchoolData.region;
    });

    if (school) {
      throw new UnprocessableEntityException([
        '해당 지역에는 이미 존재하는 학교 입니다.',
      ]);
    }

    const createdSchool = await this.schoolRepository.create(createSchoolData);

    return new SchoolVo({
      id: Number(createdSchool.id),
      name: createdSchool.name,
      region: createdSchool.region,
      createdAt: createdSchool.created_at,
    });
  }
}
