import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ClassConstructor {
  new (...args: any[]): object;
}

export function Serialize(dto: ClassConstructor, banRoutes: string[] = []) {
  return UseInterceptors(new SerializeInterceptor(dto, banRoutes));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(
    private dto: ClassConstructor,
    private banRoutes: string[],
  ) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    console.log('banRoutes', this.banRoutes);
    console.log('requestUrl', request.url);
    console.log(this.banRoutes.includes(request.url));

    if (this.banRoutes.some((route) => request.url.endsWith(route))) {
      return handler.handle();
    }
    return handler.handle().pipe(
      map((data: any) => {
        if (Array.isArray(data)) {
          return {
            count: data.length,
            users: data.map((item) =>
              plainToClass(this.dto, item, { excludeExtraneousValues: true }),
            ),
          };
        }
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
