import { UseGuards } from '@nestjs/common'
import {
	Args,
	Mutation,
	Query,
	ResolveField,
	Resolver,
	Root
} from '@nestjs/graphql'
import { UserIdArgs } from 'src/common/args/user-id.args'
import { GqlRatelimitGuard } from 'src/common/extensions/gql-rate-limit.extension'
import { CurrentUser } from 'src/utils/decorators/graphql/current-user.gql.decorator'
import { User } from '../models/user.model'
import { GqlAuthGuard } from '../utils/guards/graphql/gql-auth.guard'
import { ChangePasswordInput } from './dto/change-password.input'
import { ResetPasswordInput } from './dto/reset-password.input'
import { UpdateUserInput } from './dto/update-user.input'
import { UserService } from './user.service'

@Resolver(() => User)
export class UserResolver {
	constructor(private userService: UserService) {}

	@ResolveField(() => String)
	email(@Root() user: User, @CurrentUser() userId: string) {
		if (userId === user.id) {
			return user.email
		}
		return ''
	}

	@UseGuards(GqlAuthGuard)
	@Query(() => [User])
	async users(): Promise<User[]> {
		return this.userService.findUsers()
	}

	@UseGuards(GqlAuthGuard)
	@Query(() => User, { nullable: true })
	user(@Args('UserIdArgs') { userId }: UserIdArgs): Promise<User> {
		return this.userService.findUser(userId)
	}

	@UseGuards(GqlAuthGuard)
	@Query(() => User)
	async me(@CurrentUser() userId: string): Promise<User> {
		return this.userService.findUser(userId)
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => User)
	async updateUser(
		@CurrentUser() userId: string,
		@Args('input') input: UpdateUserInput
	) {
		return this.userService.updateUser(userId, input)
	}

	@UseGuards(GqlRatelimitGuard)
	@Mutation(() => Boolean)
	async forgotPassword(@Args('email') email: string): Promise<boolean> {
		return this.userService.forgotPassword(email)
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => User)
	async changePassword(
		@CurrentUser() userId: string,
		@Args('input') input: ChangePasswordInput
	) {
		return this.userService.changePassword(userId, input)
	}

	@Mutation(() => User)
	async resetPassword(@Args('input') input: ResetPasswordInput): Promise<User> {
		return this.userService.resetPassword(input)
	}
}
