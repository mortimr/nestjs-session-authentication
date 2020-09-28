import {
	CallHandler, ExecutionContext, Injectable,
	NestInterceptor
} from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { Observable, throwError, TimeoutError } from 'rxjs'
import { catchError, timeout } from 'rxjs/operators'
import { ErrorCodes } from '../constants'


@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			timeout(5000),
			catchError(err => {
				if (err instanceof TimeoutError) {
					return throwError(new ApolloError(ErrorCodes.REQUEST_TIMEOUT))
				}
				return throwError(err)
			})
		)
	}
}
