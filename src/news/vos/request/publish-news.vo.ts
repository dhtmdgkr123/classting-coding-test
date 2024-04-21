import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class PublishNewsVo {
  @IsString({
    message: '올바른 뉴스 내용을 입력해주세요.',
  })
  @Length(1, 253, {
    message: '뉴스 내용은 1글자 이상 253글자 이하로 입력해주세요.',
  })
  @ApiProperty({
    example: '테스트 뉴스 제목',
    description: '생성 할 뉴스 제목 입니다',
  })
  public content: string;

  public schoolId: number;
}
