import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { SchoolService } from '@/school/school.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UnprocessableEntityResponse } from '@/libs/swagger/swagger';
import { Regions } from '@/school/types/region.type';
import { CreateSchoolVo, SchoolVo } from '@/school/vos';
@Controller('schools')
@ApiTags('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  @ApiOperation({
    summary: '그 학교 관리자는 지역, 학교명으로 학교 페이지를 생성할 수 있다.',
  })
  @UnprocessableEntityResponse([
    '해당 지역에는 이미 존재하는 학교 입니다.',

    '학교 이름은 문자열로 입력해주세요.',
    '학교 이름은 1글자 이상 253글자 이하로 입력해주세요.',

    '지역 이름은 문자열로 입력해주세요.',
    '지역 이름은 1글자 이상 253글자 이하로 입력해주세요.',
    `${Regions.join()} 중 하나의 지역을 입력해주세요.`,
  ])
  @ApiResponse({ status: HttpStatus.CREATED, type: SchoolVo })
  public async create(
    @Body() createSchoolData: CreateSchoolVo,
  ): Promise<SchoolVo> {
    return this.schoolService.create(createSchoolData);
  }
}
