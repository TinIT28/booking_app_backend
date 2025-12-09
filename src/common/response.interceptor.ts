// response.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from './response.types';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse();
    return next.handle().pipe(
      map((data) => {
        // If controller returned an object with { rawResponse: true }, bypass wrapping
        if (data && data.__rawResponse) {
          // controller may attach statusCode and message by itself
          delete data.__rawResponse;
          return data;
        }

        const statusCode = res.statusCode || 200;
        // If controller returns { data, meta, message, errors } shape already, normalize
        if (
          data &&
          typeof data === 'object' &&
          ('data' in data || 'meta' in data || 'errors' in data)
        ) {
          return {
            success: statusCode >= 200 && statusCode < 300,
            statusCode,
            message:
              (data.message as string) ||
              (statusCode >= 200 && statusCode < 300 ? 'OK' : 'Error'),
            data: data.data ?? null,
            meta: data.meta ?? null,
            errors: data.errors ?? null,
          } as ApiResponse<T>;
        }

        return {
          success: statusCode >= 200 && statusCode < 300,
          statusCode,
          message: statusCode >= 200 && statusCode < 300 ? 'OK' : 'Error',
          data: data ?? null,
          meta: null,
          errors: null,
        } as ApiResponse<T>;
      }),
    );
  }
}
