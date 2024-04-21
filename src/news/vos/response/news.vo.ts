import { SchoolVo } from '@/student/vos';
import { ApiProperty } from '@nestjs/swagger';

export class NewsVo {
  @ApiProperty({
    example: 1,
    description: '발행 한 뉴스 ID 입니다',
  })
  public id: number;

  @ApiProperty({
    example: '테스트 뉴스 내용',
    description: '발행 한 뉴스 내용 입니다',
  })
  public content: string;

  @ApiProperty({
    example: 1,
    description: '뉴스 발행 시각 입니다',
  })
  public createdAt: Date;

  @ApiProperty({
    type: SchoolVo,
  })
  public school: SchoolVo;

  constructor(model: NewsVo) {
    Object.assign(this, model);
  }
}
