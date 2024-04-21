import { ApiProperty } from '@nestjs/swagger';

export class OkResource {
  @ApiProperty({
    example: true,
    description: '성공 여부 입니다',
  })
  public ok: boolean;

  constructor(model: OkResource) {
    Object.assign(this, model);
  }
}
