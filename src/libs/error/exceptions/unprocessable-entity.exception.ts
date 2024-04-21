import { Exception } from '@/libs/error/exceptions/exception';
import { HttpStatus } from '@nestjs/common';

export class UnprocessableEntityException extends Exception {
  public constructor(messages: string[]) {
    super(messages, 'Unprocessable Entity', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
