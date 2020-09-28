import { Logger, Module, OnModuleInit } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { GraphQLModule } from '@nestjs/graphql'
import { PubSub } from 'apollo-server-express'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { DispatchError } from './common/filters/DispatchError'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import { MyValidationPipe } from './common/pipes/validation.pipe'
import { DateScalar } from './common/scalars/date.scalar'
import { Mailer } from './config/module/mailer.module'
import { Mongoose } from './config/module/mongoose.module'
import { Redis } from './config/module/redis.module'
import { Session } from './config/module/session.module'
import GqlConfigService from './config/services/gql-config.service'
import { AppController } from './controllers/app.controller'
import { ComplexityPlugin } from './plugins/gql-complexity.plugin'
import { UserModule } from './user/user.module'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		Redis,
		Session,
		Mongoose,
		GraphQLModule.forRootAsync({
			useClass: GqlConfigService
		}),
		Mailer,
		AuthModule,
		UserModule
	],
	providers: [
		Logger,
		AppService,
		DateScalar,
		{
			provide: APP_FILTER,
			useClass: DispatchError
		},
		{
			provide: APP_PIPE,
			useClass: MyValidationPipe
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: LoggingInterceptor
		},
		{
			provide: 'PUB_SUB',
			useValue: new PubSub()
		}
		
	],
	controllers: [AppController]
})
export class AppModule implements OnModuleInit {
	async onModuleInit() {
		GraphQLModule.forRootAsync({
			inject: [ComplexityPlugin],
			useFactory: (complexityPlugin: ComplexityPlugin) => {
				return { plugins: [complexityPlugin] }
			}
		})
	}
}
