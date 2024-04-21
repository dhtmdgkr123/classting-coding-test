import { AppModule } from '@/app.module';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ExceptionFilter } from '@/libs/error/exception.filter';
import { UnprocessableEntityException } from '@/libs/error/exceptions/unprocessable-entity.exception';

export const appBase = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app: INestApplication = moduleFixture.createNestApplication();

  app.useGlobalFilters(new ExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        return new UnprocessableEntityException([
          ...new Set(
            errors
              .map((error) => {
                const errorInstance = error.constraints;
                const errorMessages = [];
                for (const key in errorInstance) {
                  errorMessages.push(errorInstance[key]);
                }
                return errorMessages;
              })
              .flat(),
          ),
        ]);
      },
    }),
  );

  return app;
};

export const randomIntByRange = (mix: number, max: number) =>
  Math.floor(Math.random() * (max - mix + 1)) + mix;
