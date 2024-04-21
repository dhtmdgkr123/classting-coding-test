import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  SubscribeSchoolVo,
  UnSubScribeVo,
  InquirySchoolVo,
  InquiryNewsVo,
  SubscriptionVo,
  InquiryNewsFeedsVo,
} from '@/student/vos';
import { NewsVo } from '@/news/vos';

import { StudentService } from '@/student/student.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  InternalServerErrorResponse,
  UnprocessableEntityResponse,
} from '@/libs/swagger/swagger';
import { OkResource } from '@/libs/resource/ok.resource';

@Controller('students')
@ApiTags('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post(':studentId/subscriptions/:schoolId')
  @ApiParam({
    name: 'schoolId',
    type: 'number',
    description: '학교 아이디',
  })
  @ApiParam({
    name: 'studentId',
    type: 'number',
    description: '학생 아이디',
  })
  @UnprocessableEntityResponse([
    '존재하지 않는 학생 입니다.',
    '존재하지 않는 학교 입니다.',
    '이미 구독한 학교 입니다.',
  ])
  @ApiOperation({ summary: '학생은 학교 페이지를 구독할 수 있다.' })
  public async subscribe(
    @Param() subscribeSchool: SubscribeSchoolVo,
  ): Promise<OkResource> {
    return this.studentService.subscribe(subscribeSchool);
  }

  @ApiParam({
    name: 'schoolId',
    type: 'number',
    description: '학교 아이디',
  })
  @ApiParam({
    name: 'studentId',
    type: 'number',
    description: '학생 아이디',
  })
  @UnprocessableEntityResponse([
    '존재하지 않는 학생 입니다.',
    '존재하지 않는 학교 입니다.',
    '해당 학교는 구독하지 않았습니다.',
  ])
  @ApiOperation({
    summary: '학생은 구독 중인 학교 페이지를 구독 취소할 수 있다.',
  })
  @Delete(':studentId/subscriptions/:schoolId')
  public async unsubscribe(@Param() unsubscribeSchool: UnSubScribeVo) {
    return this.studentService.unsubscribe(unsubscribeSchool);
  }

  @ApiParam({
    name: 'studentId',
    type: 'number',
    description: '학생 아이디',
  })
  @ApiResponse({
    status: 200,
    description: '구독중인 학교 리스트',
    type: [SubscriptionVo],
  })
  @ApiOperation({
    summary: '학생은 구독 중인 학교 페이지 목록을 확인할 수 있다.',
  })
  @UnprocessableEntityResponse(['존재하지 않는 학생 입니다.'])
  @InternalServerErrorResponse('예기치 않은 학교 ID가 존재 할 시 발생합니다.', [
    '올바르지 않은 데이터 입니다.',
  ])
  @Get(':studentId/subscriptions')
  public async getSubscriptions(@Param() getSubscription: InquirySchoolVo) {
    return this.studentService.getSubscriptions(getSubscription);
  }

  @Get(':studentId/subscriptions/:schoolId/news')
  @ApiOperation({
    summary: '학생은 구독 중인 학교 페이지별 소식을 볼 수 있다.',
  })
  @ApiParam({
    name: 'schoolId',
    type: 'number',
    description: '학교 아이디',
  })
  @ApiParam({
    name: 'studentId',
    type: 'number',
    description: '학생 아이디',
  })
  @ApiResponse({
    status: 200,
    description: '구독중인 학교 소식 리스트',
    type: [NewsVo],
  })
  @UnprocessableEntityResponse([
    '존재하지 않는 학생 입니다.',
    '존재하지 않는 학교 입니다.',
  ])
  public async getNews(@Param() getNews: InquiryNewsVo) {
    return this.studentService.getNews(getNews);
  }

  @ApiParam({
    name: 'studentId',
    type: 'number',
    description: '학생 아이디',
  })
  @ApiOperation({
    summary: '학생은 구독 중인 학교 소식을 자신의 뉴스피드에서 모아볼 수 있다.',
  })
  @UnprocessableEntityResponse(['존재하지 않는 학생 입니다.'])
  @InternalServerErrorResponse('예기치 않은 학교 ID가 존재 할 시 발생합니다.', [
    '올바르지 않은 데이터 입니다.',
  ])
  @Get(':studentId/news-feeds')
  public async getNewsFeeds(@Param() getNewsFeeds: InquiryNewsFeedsVo) {
    return this.studentService.getNewsFeeds(getNewsFeeds);
  }
}
