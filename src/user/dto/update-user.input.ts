import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator'

@InputType()
export class UpdateUserInput {
	@Field({ nullable: true })
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(20)
	username?: string
	// @Field({ nullable: true })
	// role?: Role;
}
