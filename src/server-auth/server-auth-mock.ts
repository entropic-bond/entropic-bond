import { UserCredentials } from '../auth/user-auth-types'
import { Collection } from '../types/utility-types'
import { ServerAuthService, CustomCredentials } from './server-auth'

export class ServerAuthMock extends ServerAuthService {
	constructor( userCredentials: Collection<UserCredentials<{}>> ) {
		super()
		this._userCredentials = userCredentials
	}

	getUser<T extends CustomCredentials>( userId: string ): Promise<UserCredentials<T> | undefined> {
		if ( !this._userCredentials[ userId ] ) Promise.resolve( undefined )

		return Promise.resolve( this._userCredentials[ userId ] as UserCredentials<T> )
	}

	setCustomCredentials<T extends CustomCredentials>( userId: string, customCredentials: T ): Promise<void> {
		const userCredentials = this._userCredentials[ userId ]
		if ( !userCredentials ) throw new Error( `User ${ userId } not found in the auth system` )
		userCredentials.customData = { ...customCredentials }

		return Promise.resolve()
	}

	updateUser<T extends CustomCredentials>( userId: string, credentials: Partial<UserCredentials<T>> ): Promise<UserCredentials<T>> {
		this._userCredentials[ userId ] = {
			...this._userCredentials,
			...credentials,
			id: userId
		} as UserCredentials<T>

		return Promise.resolve( this._userCredentials[ userId ] as UserCredentials<T> )
	}

	deleteUser( userId: string ): Promise<void> {
		delete this._userCredentials[ userId ]
		return Promise.resolve()
	}

	get userCredentials() {
		return this._userCredentials
	}

	notifyUserChanges() {
		// do nothing
	}

	private _userCredentials: Collection<UserCredentials<{}>>
}
