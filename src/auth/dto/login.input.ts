import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator'

@InputType()
export class LoginInput {
	@Field()
	@IsEmail()
	@IsNotEmpty()
	email: string

	@Field()
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(20)
	password: string
}
