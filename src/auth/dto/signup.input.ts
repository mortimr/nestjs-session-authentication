import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator'

@InputType()
export class SignupInput {
	@Field()
	@IsEmail()
	@IsNotEmpty()
	email: string

	@Field()
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(20)
	password: string

	@Field()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(20)
	username: string
}
