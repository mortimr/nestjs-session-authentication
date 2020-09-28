import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ForbiddenError } from 'apollo-server-express'
import { hash, verify } from 'argon2'
import { Redis } from 'ioredis'
import { RedisService } from 'nestjs-redis'
import {
	CONFIRM_EMAIL_PREFIX,
	ENV,
	ErrorCodes,
	FORGET_PASSWORD_PREFIX
} from 'src/common/constants'
import { User } from 'src/models/user.model'
import { v4 } from 'uuid'

@Injectable()
export class UtilService {
	private redisClient: Redis
	constructor(
		private redisService: RedisService,
		private configService: ConfigService
	) {
		this.redisClient = this.redisService.getClient('redis')
	}

	async createForgotPasswordLink(userId: string): Promise<string> {
		const token = v4()

		await this.redisClient.set(
			`${FORGET_PASSWORD_PREFIX}${token}`,
			userId,
			'ex',
			1000 * 60 * 20
		)

		return `${this.configService.get(
			ENV.WWW_BASE_URL
		)}/change-password/${token}`
	}

	async createVerifyLink(userId: string): Promise<string> {
		const token = v4()

		await this.redisClient.set(
			`${CONFIRM_EMAIL_PREFIX}${token}`,
			userId,
			'ex',
			1000 * 60 * 60 * 24 * 3
		)

		return `${this.configService.get(ENV.WWW_BASE_URL)}/verify/${token}`
	}

	async getUserIdFromToken(token: string, prefix: string): Promise<string> {
		const key = `${prefix}${token}`

		const userId = await this.redisClient.get(key)

		if (!userId) {
			throw new ForbiddenError(ErrorCodes.TOKEN_EXPIRED)
		}

		await this.redisClient.del(key)

		return userId
	}

	validatePassword(password: string, hashedPassword: string): Promise<boolean> {
		return verify(hashedPassword, password)
	}

	hashPassword(password: string): Promise<string> {
		return hash(password)
	}

	async getEmailConfig(emailType: 'forgot' | 'verify', { id, email }: User) {
		const link = await this.createVerifyLink(id)
		const cxtBase = {
			author: this.configService.get(ENV.AUTHOR),
			baseUrl: this.configService.get(ENV.WWW_BASE_URL),
			link,
			text2: ', you can safely delete this email.',
			text3:
				"If that doesn't work, copy and paste the following link in your browser:"
		}
		const templateConfig = {
			verify: {
				template: 'index', // The `.pug` or `.hbs` extension is appended automatically.
				subject: 'Email Confirmation',
				context: {
					...cxtBase,
					title: 'Email Confirmation',
					subject: 'Verify Email',
					h1: 'Confirm Your Email Address',
					button: 'Verify Email',
					text1:
						"Tap the button below to confirm your email address. If you didn't create an account with"
				}
			},
			forgot: {
				template: 'index', // The `.pug` or `.hbs` extension is appended automatically.
				subject: 'Password Reset',
				context: {
					...cxtBase,
					title: 'Password Reset',
					subject: 'Password Reset',
					h1: 'Reset Your Password',
					button: 'Set New Password',
					text1:
						"Tap the button below to reset your customer account password. If you didn't request a new password from"
				}
			}
		}
		return {
			to: email,
			...templateConfig[emailType]
		}
	}
}
