import { CanActivate, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'
import { GraphQLResolveInfo } from 'graphql'
import { ONE_DAY } from '../constants'
import { MyContext } from '../types/ctx.type'

export class GqlRatelimitGuard implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context)
		const { req, redisClient } = ctx.getContext<MyContext>()
		const info = ctx.getInfo<GraphQLResolveInfo>()
		const isAnon = !req.session!.userId
		const key = `rate-limit:${info.fieldName}:${
			isAnon ? req.ip : req.session!.userId
		}`

		const current = await redisClient.incr(key)
		const limit = { forgotPassword: 3 }
		if (current > limit[info.fieldName]) {
			throw new ApolloError("You're doing that too much!")
		} else if (current === 1) {
			await redisClient.expire(key, ONE_DAY)
		}

		return true
	}
}
