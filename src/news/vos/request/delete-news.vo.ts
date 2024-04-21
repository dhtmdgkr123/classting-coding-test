import { IsNumberString } from 'class-validator';

export class DeleteNewsVo {
  @IsNumberString(undefined, {
    message: '올바른 뉴스 아이디를 입력해주세요.',
  })
  public newsId: number;

  @IsNumberString(undefined, {
    message: '올바른 학교 아이디를 입력해주세요.',
  })
  public schoolId: number;

  constructor(data: DeleteNewsVo) {
    Object.assign(this, data);
  }
}
