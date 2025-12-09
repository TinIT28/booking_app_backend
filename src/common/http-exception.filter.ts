// http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorDetail } from './response.types';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: ErrorDetail[] | null = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      // If validation from class-validator Nest, res may be object with message array
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        // e.g. { message: ['xxx'], error: 'Bad Request' }
        // Normalize
        if (Array.isArray((res as any).message)) {
          message =
            (res as any).error ||
            (status >= 400 && status < 500 ? 'Bad request' : message);
          errors = (res as any).message.map((m: any) => {
            if (typeof m === 'string') return { message: m };
            if (m && m.constraints) {
              // class-validator shape
              const first = Object.values(m.constraints)[0];
              return { message: first as string, field: m.property };
            }
            return { message: JSON.stringify(m) };
          });
        } else if ((res as any).message) {
          message = (res as any).message;
        } else {
          message = JSON.stringify(res);
        }
      }
    } else {
      // Non HttpException
      this.logger.error('UnhandledException', exception as any);
      message = (exception as any)?.message || message;
    }

    const payload = {
      success: false,
      statusCode: status,
      message,
      data: null,
      meta: null,
      errors: errors ?? [{ message }],
    };

    response.status(status).json(payload);
  }
}
