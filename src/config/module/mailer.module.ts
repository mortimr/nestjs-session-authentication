import { MailerModule, MailerOptions } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { DynamicModule } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ENV } from 'src/common/constants'

export const Mailer: DynamicModule = MailerModule.forRootAsync({
	inject: [ConfigService],
	useFactory: (configService: ConfigService): MailerOptions => {
		return {
			transport: {
				service: 'SendGrid',
				auth: {
					user: configService.get(ENV.SENDGRID_USER),
					pass: configService.get(ENV.SENDGRID_PAS)
				},
				tls: {
					rejectUnauthorized:
						configService.get(ENV.TLS_REJECT_UNAUTHORIZED) === '1'
							? true
							: false
				}
			},
			template: {
				dir: process.cwd() + '/src/assets/templates/',
				adapter: new HandlebarsAdapter(),
				options: {
					strict: true
				}
			},
			defaults: {
				from: configService.get(ENV.MAIL_FROM),
				subject: configService.get(ENV.MAIL_DEFAULT_SUBJECT)
			}
		}
	}
})
