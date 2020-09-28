import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { ForbiddenError, UserInputError } from 'apollo-server-express'
import { Model } from 'mongoose'
import { ENV, ErrorCodes, FORGET_PASSWORD_PREFIX } from 'src/common/constants'
import { User } from '../models/user.model'
import { UtilService } from '../shared/services/util.service'
import { ChangePasswordInput } from '../user/dto/change-password.input'
import { ResetPasswordInput } from '../user/dto/reset-password.input'
import { UpdateUserInput } from '../user/dto/update-user.input'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name) private userModel: Model<User>,
		private utilService: UtilService,
		private mailerService: MailerService,
		private readonly configService: ConfigService
	) {}

	async findUser(userId: string) {
		return this.userModel.findById(userId)
	}

	async findUsers() {
		return this.userModel.find()
	}

	async forgotPassword(email: string) {
		const user = await this.userModel.findOne({ email })
		if (!user) {
			return true
		}
		const url = await this.utilService.createForgotPasswordLink(user.id)
		await this.mailerService.sendMail({
			to: email,
			subject: 'Password Reset',
			template: 'index', // The `.pug` or `.hbs` extension is appended automatically.
			context: {
				author: this.configService.get(ENV.AUTHOR),
				title: 'Password Reset',
				baseUrl: this.configService.get(ENV.WWW_BASE_URL),
				link: url,
				subject: 'Password Reset',
				h1: 'Reset Your Password',
				button: 'Set New Password',
				text1:
					"Tap the button below to reset your customer account password. If you didn't request a new password from",
				text2: ', you can safely delete this email.',
				text3:
					"If that doesn't work, copy and paste the following link in your browser:"
			}
		})

		return true
	}

	async updateUser(userId: string, newUserData: UpdateUserInput) {
		return this.userModel.findByIdAndUpdate(userId, newUserData)
	}

	async changePassword(
		userId: string,

		{ oldPassword, newPassword }: ChangePasswordInput
	) {
		const user = await this.userModel.findById(userId)

		if (!user) {
			throw new ForbiddenError(ErrorCodes.USER_NOT_FOUND)
		}

		const passwordValid = await this.utilService.validatePassword(
			oldPassword,
			user.password
		)

		if (!passwordValid) {
			throw new UserInputError(ErrorCodes.WRONG_CREDENTIALS)
		}

		user.password = await this.utilService.hashPassword(newPassword)

		await user.save()

		return user
	}

	async resetPassword({ token, newPassword }: ResetPasswordInput) {
		const userId = await this.utilService.getUserIdFromToken(
			token,
			FORGET_PASSWORD_PREFIX
		)

		const user = await this.userModel.findById(userId)
		if (!user) {
			throw new ForbiddenError(ErrorCodes.USER_NOT_FOUND)
		}
		user.password = await this.utilService.hashPassword(newPassword)

		await user.save()

		return user
	}
}
