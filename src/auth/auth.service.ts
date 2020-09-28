import { MailerService } from '@nestjs-modules/mailer'
import {
	Injectable
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { ForbiddenError, UserInputError } from 'apollo-server-core'
import { Model } from 'mongoose'
import { CONFIRM_EMAIL_PREFIX, ENV, ErrorCodes } from 'src/common/constants'
import { User } from '../models/user.model'
import { UtilService } from '../shared/services/util.service'
import { SignupInput } from './dto/signup.input'

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name) private userModel: Model<User>,
		private readonly utilService: UtilService,
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService
	) {}

	async createUser({
		password,
		email,
		username
	}: SignupInput): Promise<boolean> {
		const hashedPassword = await this.utilService.hashPassword(password)

		try {
			const user = await new this.userModel({
				username,
				email,
				password: hashedPassword,
				role: 'USER'
			}).save()

			const url = await this.utilService.createVerifyLink(user.id)
			await this.mailerService.sendMail({
				to: email,
				subject: 'Email Confirmation',
				template: 'index', // The `.pug` or `.hbs` extension is appended automatically.
				context: {
					author: 'YourApp',
					title: 'Email Confirmation',
					baseUrl: this.configService.get(ENV.WWW_BASE_URL),
					link: url,
					subject: 'Verify Email',
					h1: 'Confirm Your Email Address',
					button: 'Verify Email',
					text1:
						"Tap the button below to confirm your email address. If you didn't create an account with",
					text2: ', you can safely delete this email.',
					text3:
						"If that doesn't work, copy and paste the following link in your browser:"
				}
			})

			return true
		} catch (error) {
			if (error.code === 11000 && error.keyPattern.email) {
				throw new ForbiddenError(`Email ${email} already used.`)
			} else if (error.code === 11000 && error.keyPattern.username) {
				throw new ForbiddenError(`Username ${username} already used.`)
			} else {
				throw error
			}
		}
	}

	async validateUser(userId: string): Promise<User> {
		return this.userModel.findById(userId)
	}

	async verify(token): Promise<boolean> {
		const userId = await this.utilService.getUserIdFromToken(
			token,
			CONFIRM_EMAIL_PREFIX
		)
		const user = await this.userModel.findById(userId)
		if (!user) {
			throw new ForbiddenError(ErrorCodes.USER_NOT_FOUND)
		}

		user.verified = true
		await user.save()

		return true
	}

	async login(email: string, password: string): Promise<User> {
		const user = await this.userModel.findOne({ email })

		if (!user) {
			throw new ForbiddenError(ErrorCodes.USER_NOT_FOUND)
		}

		if (!user.verified) {
			throw new UserInputError(ErrorCodes.INVALID_EMAIL)
		}

		const passwordValid = await this.utilService.validatePassword(
			password,
			user.password
		)

		if (!passwordValid) {
			throw new UserInputError(ErrorCodes.WRONG_CREDENTIALS)
		}

		return user
	}
}
