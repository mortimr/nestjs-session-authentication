import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express/interfaces/nest-express-application.interface'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as rateLimit from 'express-rate-limit'
import * as helmet from 'helmet'
import { AppModule } from './app.module'
import { _prod } from './common/constants'
import './validations/user'
const main = async () => {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		cors: { origin: process.env.WWW_URL_BASE, credentials: true }
	})

	app.set('trust proxy', 1)
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

	await app.listen(process.env.PORT || 3000, () => {
		console.log(
			`🚀 Server ready at http://localhost:${process.env.PORT}/${process.env.END_POINT}`
		)
	})
}

main()
	.then(() => {
		console.log('All systems go')
	})
	.catch(e => {
		console.error('Uncaught error in startup')
		console.error('SERVER Error: ', e)
		console.trace('SERVER Trace: ', e)
	})
