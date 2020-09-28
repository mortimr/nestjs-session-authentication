import {
	ArgumentsHost,
	Catch,
	HttpException,
	Inject,
	Logger,
	LoggerService
} from '@nestjs/common'
import { GqlExceptionFilter } from '@nestjs/graphql'

@Catch()
export class DispatchError implements GqlExceptionFilter {
	constructor(@Inject(Logger) private readonly logger: LoggerService) {}
	catch(exception: HttpException, host: ArgumentsHost) {
		this.logger.error(`❌  ${exception.message}`, '', 'Error Filter')
		Logger.error(`❌  ${exception.message}`, '', 'Error Filter', false)
		return exception
	}
}
