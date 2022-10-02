import { UserCredentials } from '../auth/user-auth-types'
import { ServerAuthService, CustomCredentials } from './server-auth'

export class ServerAuthMock extends ServerAuthService {
	getUser( _userId: string ): Promise<UserCredentials> {
		return Promise.resolve({
			id: 'testUser'
		} as UserCredentials) 
	}

	setCustomCredentials( _userId: string, customCredentials: CustomCredentials ): Promise<void> {
		this._userCredentials.customData = { ...customCredentials }
		return Promise.resolve()
	}

	updateUser( _userId: string, credentials: UserCredentials ): Promise<UserCredentials> {
		this._userCredentials = {
			...this._userCredentials,
			...credentials
		}
		return Promise.resolve( this._userCredentials )
	}

	get userCredentials() {
		return this._userCredentials
	}
	private _userCredentials: UserCredentials
}
