import { Injectable } from '@nestjs/common'
import { WinstonModuleOptions } from 'nest-winston'
import { format, transports } from 'winston'

const { label, json, timestamp, align, printf, colorize, prettyPrint } = format

const config = {
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
	colors: {
		error: 'red',
		debug: 'blue',
		warn: 'yellow',
		data: 'grey',
		info: 'green',
		verbose: 'cyan',
		silly: 'magenta',
		custom: 'yellow'
	}
}

const myFormat = printf(({ level, message, label, timestamp }) => {
	// console.log(level)
	return `{\n\tlabel: ${label},\n\ttimestamp: ${timestamp},\n\tlevel: ${level},\n\tmessage: ${message}\n},`
})

@Injectable()
export class WinstonConfigService {
	createWinstonModuleOptions(): WinstonModuleOptions {
		return {
			levels: config.levels,
			format: format.combine(
				label({ label: '👻 ' }),
				json(),
				timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
				align(),
				colorize({
					colors: config.colors,
					level: true
				}),
				myFormat
			),
			defaultMeta: { service: 'user-service' },
			transports: [
				new transports.File({
					filename: 'logs/info.log',
					level: 'info'
				}),
				new transports.File({
					filename: 'logs/error.log',
					level: 'error'
				}),
				new transports.File({
					filename: 'logs/warn.log',
					level: 'warn'
				}),
				new transports.File({
					filename: 'logs/debug.log',
					level: 'debug'
				}),
				new transports.File({
					filename: 'logs/verbose.log',
					level: 'verbose'
				})
			]
		}
	}
}
