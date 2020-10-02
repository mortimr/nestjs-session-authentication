import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express/interfaces/nest-express-application.interface'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as cors from 'cors'
import * as rateLimit from 'express-rate-limit'
import * as helmet from 'helmet'
import { WinstonModule } from 'nest-winston'
import { AppModule } from './app.module'
import { _prod } from './common/constants'
import { WinstonConfigService } from './config/services/winston-config.service'

const main = async () => {
	const logger = WinstonModule.createLogger(
		new WinstonConfigService().createWinstonModuleOptions()
	)

	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		logger
	})

	app.set('trust proxy', 1)
	app.use(
		cors({
			origin: process.env.WWW_BASE_URL,
			credentials: true
		})
	)
	app.use(cookieParser())
	app.use(bodyParser.json({ limit: '50mb' }))
	app.use(
		bodyParser.urlencoded({
			limit: '50mb',
			extended: true,
			parameterLimit: 50000
		})
	)

	if (_prod) {
		app.use(helmet())

		app.use(
			rateLimit({
				windowMs: 15 * 60 * 1000, // 15 minutes
				max: 100 // limit each IP to 100 requests per windowMs
			})
		)
	}

	await app.listen(process.env.PORT || 4000, () => {
		!_prod
			? Logger.log(
					`🚀  Server ready at http://${process.env.DOMAIN!}:${process.env
						.PORT!}/${process.env.END_POINT!}`,
					'Bootstrap',
					false
			  )
			: Logger.log(
					`🚀  Server is listening on port 
						${process.env.PORT!}`,
					'Bootstrap',
					false
			  )

		!_prod &&
			Logger.log(
				`🚀  Subscriptions ready at ws://${process.env.DOMAIN!}:${process.env
					.PORT!}/${process.env.END_POINT!}`,
				'Bootstrap',
				false
			)
	})
}

main()
	.then(() => {
		Logger.log('All systems go', 'Bootstrap', false)
	})
	.catch(e => {
		Logger.error(`❌  Error starting server, ${e}`, '', 'Bootstrap', false)
	})
