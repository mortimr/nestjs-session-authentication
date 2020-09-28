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
import * as chalk from 'chalk'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { ENV } from '../constants'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	constructor(
		private configService: ConfigService,
		@Inject(Logger) private readonly logger: LoggerService
	) {}
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const PRIMARY_COLOR = this.configService.get(ENV.PRIMARY_COLOR)
		if (context.getArgs()[3]) {
			const parentType = context.getArgs()[3]['parentType']
			const fieldName = chalk
				.hex(PRIMARY_COLOR)
				.bold(`${context.getArgs()[3]['fieldName']}`)
			return next.handle().pipe(
				tap(() => {
					Logger.debug(`${parentType} » ${fieldName}`, 'GraphQL')
					this.logger.debug(`${parentType} » ${fieldName}`, 'GraphQL')
				})
			)
		} else {
			const parentType = chalk
				.hex(PRIMARY_COLOR)
				.bold(`${context.getArgs()[0].route.path}`)
			const fieldName = chalk
				.hex(PRIMARY_COLOR)
				.bold(`${context.getArgs()[0].route.stack[0].method}`)
			return next.handle().pipe(
				tap(() => {
					Logger.debug(`${parentType} » ${fieldName}`, 'GraphQL')
					this.logger.debug(`${parentType} » ${fieldName}`, 'GraphQL')
				})
			)
		}
	}
}
