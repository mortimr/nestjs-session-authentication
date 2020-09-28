import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { ForbiddenError, UserInputError } from 'apollo-server-express'
import { Model } from 'mongoose'
import { ErrorCodes, FORGET_PASSWORD_PREFIX } from 'src/common/constants'
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
		const mailConfig = await this.utilService.getEmailConfig('forgot', user)
		await this.mailerService.sendMail(mailConfig)

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
