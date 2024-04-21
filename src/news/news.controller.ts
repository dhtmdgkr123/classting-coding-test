import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { NewsService } from '@/news/news.service';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { UnprocessableEntityResponse } from '@/libs/swagger/swagger';
import { OkResource } from '@/libs/resource/ok.resource';
import { PublishNewsVo, DeleteNewsVo, EditNewsVo } from '@/news/vos';

@Controller('schools/:schoolId/news')
@ApiTags('news')
@ApiParam({
  name: 'schoolId',
  type: 'number',
  description: '학교 아이디',
})
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @ApiOperation({
    summary: '학교 관리자는 학교 페이지 내에 소식을 작성할 수 있다.',
  })
  @UnprocessableEntityResponse([
    '올바른 뉴스 내용을 입력해주세요.',
    '존재하지 않는 학교 입니다.',
    '뉴스 내용은 1글자 이상 253글자 이하로 입력해주세요.',
  ])
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '뉴스 발행 성공',
    type: OkResource,
  })
  public async publish(
    @Param('schoolId') schoolId: string,
    @Body() createNewsData: PublishNewsVo,
  ) {
    createNewsData.schoolId = Number(schoolId);
    return this.newsService.publish(createNewsData);
  }

  @Delete(':newsId')
  @ApiOperation({ summary: '학교 관리자는 작성된 소식을 삭제할 수 있다.' })
  @UnprocessableEntityResponse([
    '존재하지 않는 학교 입니다.',
    '존재하지 않는 뉴스 입니다.',
    '이미 삭제된 뉴스 입니다.',
  ])
  @ApiParam({
    name: 'newsId',
    type: 'number',
    description: '삭제 할 뉴스 아이디',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '뉴스 삭제 성공',
    type: OkResource,
  })
  public async delete(@Param() requestData: DeleteNewsVo) {
    return this.newsService.delete(requestData);
  }

  @Put(':newsId')
  @ApiParam({
    name: 'newsId',
    type: 'number',
    description: '수정 할 뉴스 아이디',
  })
  @ApiOperation({ summary: '학교 관리자는 작성된 소식을 수정할 수 있다.' })
  @UnprocessableEntityResponse([
    '올바른 뉴스 내용을 입력해주세요.',
    '존재하지 않는 학교 입니다.',
    '존재하지 않는 뉴스 입니다.',
    '이미 삭제된 뉴스 입니다.',
    '뉴스 내용은 1글자 이상 253글자 이하로 입력해주세요.',
  ])
  @ApiResponse({
    status: HttpStatus.OK,
    description: '뉴스 수정 성공',
    type: OkResource,
  })
  public async edit(
    @Param('schoolId') schoolId: string,
    @Param('newsId') newsId: string,
    @Body() editNewsData: EditNewsVo,
  ) {
    return this.newsService.edit(
      new EditNewsVo({
        schoolId: Number(schoolId),
        newsId: Number(newsId),
        content: editNewsData.content,
      }),
    );
  }
}
