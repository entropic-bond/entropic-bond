import { UserCredentials } from '../auth/user-auth-types'

export interface CustomCredentials {
	[ key: string ]: unknown
}

export abstract class ServerAuthService {
	abstract setCustomCredentials<T extends CustomCredentials>( userId: string, customCredentials: T ): Promise<void>
	abstract getUser<T extends CustomCredentials>( userId: string ): Promise<UserCredentials<T>>
	abstract updateUser<T extends CustomCredentials>( userId: string, credentials: Partial<UserCredentials<T>> ): Promise<UserCredentials<T>>
	abstract deleteUser( userId: string ): Promise<void>
}

export class ServerAuth extends ServerAuthService {
	static error = { shouldBeRegistered: 'You should register a Server Auth service before using the Server Auth.' }

	protected constructor(){ super() }

	static useServerAuthService( authService: ServerAuthService ) {
		if ( ServerAuth._authService != authService ) {
			ServerAuth._authService = authService
			this._instance = undefined
		}
	}

	static get instance() {
		if ( !ServerAuth._authService ) throw new Error( ServerAuth.error.shouldBeRegistered )
		return this._instance || (this._instance = new ServerAuth() )
	}
	
	getUser<T extends CustomCredentials>( userId: string ): Promise<UserCredentials<T>> {
		return ServerAuth._authService.getUser( userId )
	}

	updateUser<T extends CustomCredentials>( userId: string, credentials: Partial<UserCredentials<T>> ): Promise<UserCredentials<T>> {
		return ServerAuth._authService.updateUser( userId, credentials )
	}
	
	setCustomCredentials<T extends CustomCredentials>( userId: string, customCredentials: T ): Promise<void> {
		return ServerAuth._authService.setCustomCredentials( userId, customCredentials )
	}

	deleteUser( userId: string ) {
		return ServerAuth._authService.deleteUser( userId )
	}

	private static _instance: ServerAuth = undefined
	private static _authService: ServerAuthService
}