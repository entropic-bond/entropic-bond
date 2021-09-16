export interface UserCredentials {
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

export type AuthProvider = 'email' | 'facebook' | 'google' | 'twitter'

export interface SignData {
	authProvider: AuthProvider
	email?: string
	password?: string
	name?: string
	verificationLink?: string
}
