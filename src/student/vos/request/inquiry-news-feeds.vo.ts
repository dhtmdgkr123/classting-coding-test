import { IsNumberString } from 'class-validator';

export class InquiryNewsFeedsVo {
  @IsNumberString(undefined, { message: '올바른 학생 아이디를 입력해주세요.' })
  public studentId: number;
}
