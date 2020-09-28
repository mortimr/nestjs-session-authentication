import { ConfigService } from '@nestjs/config'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { validate } from 'class-validator'
import { ENV } from 'src/common/constants'
import { MyContext } from 'src/common/types/ctx.type'
import { MyCtx } from 'src/utils/decorators/graphql/ctx.decorator'
import { GqlSession } from 'src/utils/decorators/graphql/gql-session.decorator'
import { User } from '../models/user.model'
import { AuthService } from './auth.service'
import { LoginInput } from './dto/login.input'
import { SignupInput } from './dto/signup.input'

@Resolver(() => User || Boolean)
export class AuthResolver {
	constructor(
		private authService: AuthService,
		private configService: ConfigService
	) {}

	@Mutation(() => Boolean)
	async signup(@Args('input') input: SignupInput) {
		try {
			await validate('createUser', input)
		} catch (error) {
			console.log(error)
		}
		return this.authService.createUser(input)
	}

	@Mutation(() => Boolean)
	async verify(@Args('token') token: string) {
		return this.authService.verify(token)
	}

	@Mutation(() => User)
	async login(
		@Args('input')
		{ email, password }: LoginInput,
		@GqlSession() session
	) {
		const result = await this.authService.login(email, password)
		session.userId = result.id
		return result
	}

	@Mutation(() => Boolean)
	logout(@MyCtx() { req, res }: MyContext) {
		return new Promise(resolve =>
			req.session.destroy(err => {
				res.clearCookie(this.configService.get(ENV.COOKIE_NAME))
				if (err) {
					console.log(err)
					resolve(false)
					return
				}

				resolve(true)
			})
		)
	}
}
