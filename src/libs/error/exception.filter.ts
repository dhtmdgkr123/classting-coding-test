import {
  ArgumentsHost,
  Catch,
  ExceptionFilter as NestExceptionFilter,
} from '@nestjs/common';
import { Exception } from '@/libs/error/exceptions/exception';

@Catch(Exception)
export class ExceptionFilter implements NestExceptionFilter {
  public async catch(exception: Exception, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const error = exception.getResponse();

    response.status(status).json(error);
  }
}
