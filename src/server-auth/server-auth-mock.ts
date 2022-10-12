import { UserCredentials } from '../auth/user-auth-types'
import { ServerAuthService, CustomCredentials } from './server-auth'

export class ServerAuthMock extends ServerAuthService {
	getUser<T extends CustomCredentials>( _userId: string ): Promise<UserCredentials<T>> {
		return Promise.resolve({
			id: 'testUser'
		} as UserCredentials<T>) 
	}

	setCustomCredentials( _userId: string, customCredentials: CustomCredentials ): Promise<void> {
		this._userCredentials.customData = { ...customCredentials }
		return Promise.resolve()
	}

	updateUser<T extends CustomCredentials>( _userId: string, credentials: UserCredentials<T> ): Promise<UserCredentials<T>> {
		this._userCredentials = {
			...this._userCredentials,
			...credentials
		}
		return Promise.resolve( this._userCredentials as UserCredentials<T> )
	}

	get userCredentials() {
		return this._userCredentials
	}
	private _userCredentials: UserCredentials<{}>
}
