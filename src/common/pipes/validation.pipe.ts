import { Injectable, ValidationPipe } from '@nestjs/common'
import { UserInputError } from 'apollo-server-core'

@Injectable()
export class MyValidationPipe extends ValidationPipe {
	constructor() {
		super()
		this.exceptionFactory = errors => {
			const formattedErrors = this.formatErrors(errors)
			throw new UserInputError(`Form Arguments invalid: ${formattedErrors}`)
		}
	}

	private formatErrors(errors: any[]) {
		return errors
			.map(err => {
				// tslint:disable-next-line: forin
				for (const property in err.constraints) {
					return err.constraints[property]
				}
			})
			.join(', ')
	}
}
