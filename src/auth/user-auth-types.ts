export interface UserCredentials<T extends {}> {
	id: string
	email: string
	name?: string
	pictureUrl?: string
	phoneNumber?: string
	emailVerified?: boolean
	customData?: T
	lastLogin?: number
	creationDate?: number
}

export type AuthProvider = 'email' | 'facebook' | 'google' | 'twitter'

export interface SignData {
	authProvider: AuthProvider
	email?: string
	password?: string
	name?: string
	verificationLink?: string
}
