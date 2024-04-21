import { Regions } from '@/school/types/region.type';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Length } from 'class-validator';

export class CreateSchoolVo {
  @IsString({
    message: '올바른 학교 이름을 입력해주세요.',
  })
  @Length(1, 253, {
    message: '학교 이름은 1글자 이상 253글자 이하로 입력해주세요.',
  })
  @ApiProperty({
    example: '테스트 학교 이름',
    description: '생성 할 학교 이름 입니다',
  })
  public name: string;

  @IsString({
    message: '올바른 지역 이름을 입력해주세요.',
  })
  @Length(1, 253, {
    message: '지역 이름은 1글자 이상 253글자 이하로 입력해주세요.',
  })
  @IsEnum(Regions, {
    message: `${Regions.join()} 중 하나의 지역을 입력해주세요.`,
  })
  @ApiProperty({
    example: '서울',
    enum: Regions,
    description: '생성 할 학교의 지역 입니다',
  })
  public region: string;
}
