import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator'

@InputType()
export class ChangePasswordInput {
	@Field()
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(20)
	oldPassword: string

	@Field()
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(20)
	newPassword: string
}
