import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { setupSwagger } from '@/libs/swagger/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ExceptionFilter } from '@/libs/error/exception.filter';
import { UnprocessableEntityException } from '@/libs/error/exceptions/unprocessable-entity.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
  setupSwagger(app);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
