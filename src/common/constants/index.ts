export const _prod = process.env.NODE_ENV === 'production'
export const FORGET_PASSWORD_PREFIX = 'forget-password:'
export const CONFIRM_EMAIL_PREFIX = 'confirm-email:'
export const ONE_DAY = 60 * 60 * 24
export const ENV = {
	WWW_BASE_URL: 'WWW_BASE_URL',
	NODE_ENV: 'NODE_ENV',
	MONGO_URL: 'MONGO_URL',
	MONGO_USER: 'MONGO_USER',
	MONGO_PASSWORD: 'MONGO_PASSWORD',
	MONGO_DB_NAME: 'MONGO_DB_NAME',
	MONGO_HOST: 'MONGO_HOST',
	MONGO_PORT: 'MONGO_PORT',
	CORS_ENABLE: 'CORS_ENABLE',
	PORT: 'PORT',
	GRAPHQL_SCHEMA_DEST: 'GRAPHQL_SCHEMA_DEST',
	COOKIE_NAME: 'COOKIE_NAME',
	SECRET: 'SECRET',
	REDIS_HOST: 'REDIS_HOST',
	REDIS_PORT: 'REDIS_PORT',
	SENDGRID_USER: 'SENDGRID_USER',
	SENDGRID_PAS: 'SENDGRID_PAS',
	MAIL_FROM: 'MAIL_FROM',
	MAIL_DEFAULT_SUBJECT: 'MAIL_DEFAULT_SUBJECT',
	TLS_REJECT_UNAUTHORIZED: 'TLS_REJECT_UNAUTHORIZED',
	AUTHOR: 'AUTHOR',
	GRAPHQL_DEPTH_LIMIT: 'GRAPHQL_DEPTH_LIMIT',
	PRIMARY_COLOR: 'PRIMARY_COLOR',
	END_POINT: 'END_POINT',
	DOMAIN: 'DOMAIN'
}

export const ErrorCodes = {
	REQUEST_TIMEOUT:
		'The server did not receive a complete request message within the requested time.',
	INVALID_ID: 'Invalid id',
	CLIENT_NOT_FOUND: 'Client was not found in the database!',
	NETWORK_ERROR: 'A network error occurred!',
	ACCESS_VIOLATION: 'Access violation!',
	USER_EXISTS: 'User already exists!',
	USER_NOT_FOUND: 'User was not found in the database!',
	EMAIL_EXISTS: 'This email already exists ',
	PERMISSION_ERROR: "You don't have permission to access it!",
	WRONG_CREDENTIALS:
		'Your credentials are incorrect. Please try again or reset your password',
	UNAUTH: 'Your token is invalid or it might have expired.',
	WRONG_FILE: 'Wrong file type, please select again',
	INVALID_EMAIL: 'Sorry, you must validate email first',
	USER_PASSWORD_CANNOT_BE_INVALID:
		'The password must be eight characters or longer and must contain a minimum of 1 lower case letter [a-z], a minimum of 1 upper case letter [A-Z], a minimum of 1 numeric character [0-9], a minimum of 1 special character ',
	USER_EMPTY_OLD_PASSWORD: 'Old password missing!',
	USER_INVALID_OLD_PASSWORD: 'Invalid old password!',
	USER_PASSWORD_NOT_EQUAL: 'Passwords are not equal!',
	USER_NAME_CANNOT_BE_EMPTY: 'User name cannot be empty!',
	USER_SURNAME_CANNOT_BE_EMPTY: 'User surname cannot be empty!',
	USER_EMAIL_CANNOT_BE_EMPTY: 'User email cannot be empty!',
	USER_ROLE_CANNOT_BE_EMPTY: 'User role cannot be empty!',
	USER_EMAIL_CANNOT_BE_INVALID: 'Must be a valid email address',
	USER_PASSWORD_CANNOT_BE_EMPTY: 'User password cannot be empty!',
	TOKEN_EXPIRED: 'Token Expired'
}
