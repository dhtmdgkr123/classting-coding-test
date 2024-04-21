import { ApiProperty } from '@nestjs/swagger';
import { SchoolVo } from '@/student/vos/response/school.vo';

export class SubscriptionVo {
  @ApiProperty({
    example: 1,
    description: '구독 ID 입니다',
  })
  public id: number;

  @ApiProperty({
    example: '2021-10-12T00:00:00.000Z',
    description: '구독 일자 입니다',
  })
  public subscribeAt: Date;

  @ApiProperty({
    type: SchoolVo,
  })
  public school: SchoolVo;

  constructor(model: SubscriptionVo) {
    Object.assign(this, model);
  }
}
