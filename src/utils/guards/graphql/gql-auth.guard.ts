import {
	CanActivate,
	ExecutionContext,
	Injectable
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthenticationError } from 'apollo-server-express'
import { ErrorCodes } from 'src/common/constants'

@Injectable()
export class GqlAuthGuard implements CanActivate {
	canActivate(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context).getContext()
		if (!ctx.req.session.userId) {
			throw new AuthenticationError(ErrorCodes.UNAUTH)
		}
		return true
	}
}
