import { Injectable } from '@nestjs/common'
import { WinstonModuleOptions } from 'nest-winston'
import { format, transports } from 'winston'
const { label, json, timestamp, align, printf, colorize, prettyPrint } = format

@Injectable()
export class WinstonConfigService {
	createWinstonModuleOptions(): WinstonModuleOptions {
		return {
			levels: {
				error: 0,
				debug: 1,
				warn: 2,
				data: 3,
				info: 4,
				verbose: 5,
				silly: 6,
				custom: 7
			},
			format: format.combine(
				json(),
				timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
				align(),
				prettyPrint()
			),
			transports: [
				new transports.Console({
					level: 'info'
				}),
				new transports.File({
					filename: 'logs/combined.log'
				})
			],
			exceptionHandlers: [
				new transports.File({ filename: 'logs/exceptions.log' })
			]
		}
	}
}
