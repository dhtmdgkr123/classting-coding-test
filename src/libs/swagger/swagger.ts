import { INestApplication, applyDecorators } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('School API')
    .setDescription('The School API description')
    .setVersion(process.env.npm_package_version ?? 'unset version')
    .addTag('school')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/documentation', app, document);
};

export const ForbiddenResponse = () => {
  return applyDecorators(
    ApiForbiddenResponse({
      description:
        '권한이 없는경우 또는 유효성 검사에 실패 한 경우 발생합니다.',
      schema: {
        properties: {
          messages: {
            type: 'array',
            description: '에러 메세지 들 입니다',
            example: ['올바르지 않은 접근 입니다.'],
          },
          error: {
            type: 'string',
            description: '에러에 관한 영문 메세지 입니다',
            example: 'Forbidden',
          },
        },
      },
    }),
  );
};

export const UnprocessableEntityResponse = (errorMessages: string[]) => {
  return applyDecorators(
    ApiUnprocessableEntityResponse({
      description:
        '유효성 검사에 실패하거나 기타 처리 할 수 없는 데이터일 경우 발생합니다.',
      schema: {
        properties: {
          messages: {
            type: 'array',
            description: '에러 메세지 들 입니다',
            example: errorMessages,
          },
          error: {
            type: 'string',
            description: '에러에 관한 영문 메세지 입니다',
            example: 'Unprocessable Entity',
          },
        },
      },
    }),
  );
};

export const InternalServerErrorResponse = (
  description: string,
  errorMessages: string[],
) => {
  return applyDecorators(
    ApiInternalServerErrorResponse({
      description: description,
      schema: {
        properties: {
          messages: {
            type: 'array',
            description: '에러 메세지 들 입니다',
            example: errorMessages,
          },
          error: {
            type: 'string',
            description: '에러에 관한 영문 메세지 입니다',
            example: 'Internal Server Error',
          },
        },
      },
    }),
  );
};

export const UnauthorizedResponse = () => {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: '올바르지 않은 토큰으로 접근 시 발생합니다',
      schema: {
        properties: {
          messages: {
            type: 'array',
            description: '에러 메세지 들 입니다',
            example: ['로그인이 필요합니다.'],
          },
          error: {
            type: 'string',
            description: '에러에 관한 영문 메세지 입니다',
            example: 'Unauthorized',
          },
        },
      },
    }),
  );
};
