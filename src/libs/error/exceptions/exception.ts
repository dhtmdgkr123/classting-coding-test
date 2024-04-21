import { ErrorResponse } from '@/libs/error/response.type';

export class Exception extends Error {
  public constructor(
    public readonly messages: string[],
    public readonly error: string,
    public readonly statusCode: number,
  ) {
    super();
  }

  public getStatus(): number {
    return this.statusCode;
  }

  public getResponse(): ErrorResponse {
    return {
      error: this.error,
      messages: this.messages,
    };
  }
}
