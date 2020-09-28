import { Injectable } from '@nestjs/common'
// import { DynamicModule } from '@nestjs/common'
// import { WinstonModule } from 'nest-winston/dist/winston.module'
// import { ConfigService } from '@nestjs/config'
// import { WinstonModule, WinstonModuleOptions ,} from 'nest-winston'
// import { format, transports } from 'winston'
// export const Winston: DynamicModule = WinstonModule.forRootAsync({
// 	inject: [ConfigService],
// 	useFactory: (configService: ConfigService): WinstonModuleOptions => {
// 		return {
// 			exitOnError: false,
// 			format: format.combine(
// 				format.colorize(),
// 				format.timestamp(),
// 				format.printf(msg => {
// 					return `${msg.timestamp} [${msg.level}] - ${msg.message}`
// 				})
// 			),
// 			transports: [new transports.Console({ level: 'debug' })] // alert > error > warning > notice > info > debug
// 		}
// 	}
// })
import { ConfigService } from '@nestjs/config'
import { WinstonModuleOptionsFactory } from 'nest-winston'

@Injectable()
export class WinstonConfigService implements WinstonModuleOptionsFactory {
	constructor(private configService: ConfigService) {}
	createWinstonModuleOptions: () => {}
}
