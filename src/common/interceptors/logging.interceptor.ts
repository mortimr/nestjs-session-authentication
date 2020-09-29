import {
	CallHandler,
	ExecutionContext,
	Inject,
	Injectable,
	Logger,
	LoggerService,
	NestInterceptor
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	constructor(
		private configService: ConfigService,
		@Inject(Logger) private readonly logger: LoggerService
	) {}
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		if (context.getArgs()[3]) {
			const parentType = context.getArgs()[3]['parentType']
			const fieldName = context.getArgs()[3]['fieldName']
			return next.handle().pipe(
				tap(() => {
					this.logger.debug(`${parentType} » ${fieldName}`, 'GraphQL')
				})
			)
		} else {
			const parentType = context.getArgs()[0].route.path
			const fieldName = context.getArgs()[0].route.stack[0].method
			return next.handle().pipe(
				tap(() => {
					this.logger.debug(`${parentType} » ${fieldName}`, 'GraphQL')
				})
			)
		}
	}
}
