import { Field, InputType } from '@nestjs/graphql'
import { IsMongoId, IsNotEmpty } from 'class-validator'

@InputType()
export class UserIdArgs {
	@Field()
	@IsNotEmpty()
	@IsMongoId()
	userId: string
}
