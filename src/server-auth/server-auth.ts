import { UserCredentials } from '../auth/user-auth-types'

export interface CustomCredentials {
	[ key: string ]: unknown
}

export abstract class ServerAuthService {
	abstract setCustomCredentials( userId: string, customCredentials: CustomCredentials ): Promise<void>
	abstract getUser<T extends CustomCredentials>( userId: string ): Promise<UserCredentials<T>>
	abstract updateUser<T extends CustomCredentials>( userId: string, credentials: UserCredentials<T> ): Promise<UserCredentials<T>>
}

export class ServerAuth extends ServerAuthService {
	static error = { shouldBeRegistered: 'You should register a Server Auth service before using the data Store.' }

	protected constructor(){ super() }

	static useServerAuthService( authService: ServerAuthService ) {
		if ( ServerAuth._authService != authService ) {
			ServerAuth._authService = authService
			this._instance = undefined
		}
	}

	static get instance() {
		return this._instance || (this._instance = new ServerAuth() )
	}
	
	getUser<T extends CustomCredentials>( userId: string ): Promise<UserCredentials<T>> {
		if ( !ServerAuth._authService ) throw new Error( ServerAuth.error.shouldBeRegistered )
		return ServerAuth._authService.getUser( userId )
	}

	updateUser<T extends CustomCredentials>( userId: string, credentials: UserCredentials<T> ): Promise<UserCredentials<T>> {
		if ( !ServerAuth._authService ) throw new Error( ServerAuth.error.shouldBeRegistered )
		return ServerAuth._authService.updateUser( userId, credentials )
	}
	
	setCustomCredentials( userId: string, customCredentials: CustomCredentials ): Promise<void> {
		if ( !ServerAuth._authService ) throw new Error( ServerAuth.error.shouldBeRegistered )
		return ServerAuth._authService.setCustomCredentials( userId, customCredentials )
	}

	private static _instance: ServerAuth = undefined
	private static _authService: ServerAuthService
}