import { IsNumberString } from 'class-validator';

export class SubscribeSchoolVo {
  @IsNumberString(undefined, {
    message: '올바른 학생 아이디를 입력해주세요.',
  })
  public studentId: number;

  @IsNumberString(undefined, {
    message: '올바른 학교 아이디를 입력해주세요.',
  })
  public schoolId: number;
}
