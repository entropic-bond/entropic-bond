
export interface UserCredential {
	id: string
	email: string
	name?: string
	pictureUrl?: string
	phoneNumber?: string
	emailVerified?: boolean
	customData: {[ key: string ]: unknown }
	lastLogin: number
	creationDate: number
}

export interface SignData {
	authProvider: string
	email?: string
	password?: string
	name?: string
	verificationLink?: string
}
