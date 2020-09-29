import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'
import * as depthLimit from 'graphql-depth-limit'
import { Redis } from 'ioredis'
import { RedisService } from 'nestjs-redis'
import { ENV, ErrorCodes, _prod } from 'src/common/constants'

@Injectable()
class GqlConfigService implements GqlOptionsFactory {
	constructor(
		private configService: ConfigService,
		private redisService: RedisService
	) {}

	createGqlOptions(): GqlModuleOptions {
		const END_POINT = this.configService.get(ENV.END_POINT)
		const GRAPHQL_DEPTH_LIMIT = this.configService.get(ENV.GRAPHQL_DEPTH_LIMIT)
		const redisClient: Redis = this.redisService.getClient('redis')
		return {
			bodyParserConfig: { limit: '50mb' },
			onHealthCheck: () => {
				return new Promise((resolve, reject) => {
					// Replace the `true` in this conditional with more specific checks!
					if (true) {
						resolve()
					} else {
						reject()
					}
				})
			},
			playground: !_prod && {
				settings: {
					'request.credentials': 'include' // possible values: 'omit', 'include', 'same-origin'
				}
			},
			path: `/${END_POINT!}`,
			buildSchemaOptions: {
				numberScalarMode: 'integer'
			},
			sortSchema: true,
			autoSchemaFile:
				this.configService.get(ENV.GRAPHQL_SCHEMA_DEST) ||
				'./src/schema.graphql',
			debug: !_prod,
			tracing: !_prod,
			introspection: !_prod,
			cors: this.configService.get(ENV.CORS_ENABLE) === '1' ? true : false,
			context: ({ req, res }) => ({
				req,
				res,
				redisClient
			}),
			validationRules: [
				depthLimit(
					GRAPHQL_DEPTH_LIMIT,
					{ ignore: [/_trusted$/, 'idontcare'] },
					depths => {
						if (depths[''] === GRAPHQL_DEPTH_LIMIT - 1) {
							Logger.warn(
								`⚠️  You can only descend 
									${GRAPHQL_DEPTH_LIMIT!} levels.`,
								'GraphQL',
								false
							)
						}
					}
				)
			],
			cacheControl: _prod && {
				defaultMaxAge: 5,
				stripFormattedExtensions: false,
				calculateHttpHeaders: false
			},
			formatError: err => {
				if (err.message.startsWith('Database Error: ')) {
					return new ApolloError(ErrorCodes.NETWORK_ERROR)
				}
				return {
					message: err.message,
					code: err.extensions && err.extensions.code,
					locations: err.locations,
					path: err.path
				}
			},
			subscriptions: {
				path: `/${END_POINT!}`,
				keepAlive: 1000,
				onConnect: async (connectionParams, webSocket, context) => {
					!_prod && Logger.debug(`🔗  Connected to websocket`, 'GraphQL')
				},
				onDisconnect: async (webSocket, context) => {
					!_prod &&
						Logger.error(`❌  Disconnected to websocket`, '', 'GraphQL', false)
				}
			},
			installSubscriptionHandlers: true,
			uploads: {
				maxFieldSize: 2, // 1mb
				maxFileSize: 20, // 20mb
				maxFiles: 5
			}
		}
	}
}
export default GqlConfigService
