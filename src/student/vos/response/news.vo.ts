import { ApiProperty } from '@nestjs/swagger';
import { SchoolVo } from '@/student/vos/response/school.vo';

export class NewsVo {
  @ApiProperty({
    example: 1,
    description: '뉴스 ID 입니다',
  })
  public newsId: number;

  @ApiProperty({
    example: '2021-10-12T00:00:00.000Z',
    description: '뉴스 생성 일자 입니다',
  })
  public createdAt: Date;

  @ApiProperty({
    example: 'test-123',
    description: '뉴스 내용 입니다.',
  })
  public content: string;

  @ApiProperty({
    type: SchoolVo,
  })
  public school: SchoolVo;

  constructor(data: NewsVo) {
    Object.assign(this, data);
  }
}
