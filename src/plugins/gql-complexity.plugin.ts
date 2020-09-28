import { GraphQLSchemaHost, Plugin } from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'
import {
  ApolloServerPlugin,
  GraphQLRequestListener
} from 'apollo-server-plugin-base'
import {
  fieldExtensionsEstimator,
  getComplexity,
  simpleEstimator
} from 'graphql-query-complexity'

@Plugin()
export class ComplexityPlugin implements ApolloServerPlugin {
	constructor(private gqlSchemaHost: GraphQLSchemaHost) {}

	requestDidStart(): GraphQLRequestListener {
		const { schema } = this.gqlSchemaHost

		return {
			didResolveOperation({ request, document }) {
				const complexity = getComplexity({
					schema,
					operationName: request.operationName,
					query: document,
					variables: request.variables,
					estimators: [
						fieldExtensionsEstimator(),
						simpleEstimator({ defaultComplexity: 1 })
					]
				})
				if (complexity >= 20) {
					throw new ApolloError(
						`Query is too complex: ${complexity}. Maximum allowed complexity: 20`
					)
				}
			}
		}
	}
}
