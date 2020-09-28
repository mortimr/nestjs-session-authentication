import { ArgumentsHost, Catch, HttpException } from '@nestjs/common'
import { GqlExceptionFilter } from '@nestjs/graphql'

@Catch()
export class DispatchError implements GqlExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		return exception
	}
}
