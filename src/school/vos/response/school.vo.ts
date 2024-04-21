import { ApiProperty } from '@nestjs/swagger';

export class SchoolVo {
  @ApiProperty({
    example: 1,
    description: '생성 한 학교 ID 입니다',
  })
  public id: number;

  @ApiProperty({
    example: '테스트 학교 이름',
    description: '생성 한 학교 이름 입니다',
  })
  public name: string;

  @ApiProperty({
    example: '서울',
    description: '생성 한 학교의 지역명 입니다',
  })
  public region: string;

  @ApiProperty({
    example: '2021-10-12T00:00:00.000Z',
    description: '생성 일자 입니다',
  })
  public createdAt: Date;
  constructor(model: SchoolVo) {
    Object.assign(this, model);
  }
}
