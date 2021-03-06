import { AuthService, RejectedCallback, ResovedCallback } from "./auth"
import { UserCredentials, SignData, AuthProvider } from "./user-auth-types"

export class AuthMock extends AuthService {

	signUp( signData: SignData ): Promise<UserCredentials> {
		const { verificationLink, email, password } = signData
	
		const promise = new Promise<UserCredentials>( async ( resolve: ResovedCallback, reject: RejectedCallback ) => {
			if ( password !== 'fail' && email !== 'fail' ) {
				this._loggedUser = this.userCredentials( signData )
				this._loggedUser.id += '__from_auth' 
				this._fakeRegisteredUsers.push( this._loggedUser )
				resolve( this._loggedUser )
				this.notifyChange?.( this._loggedUser )
			} 
			else {
				reject({ code: 'userNotFound', message: verificationLink || 'Test auth error' })
				this.notifyChange?.( undefined )
			}
		})
		this.pendingPromises.push( promise )
		return promise
	}

	login( signData: SignData ): Promise<UserCredentials> {
		const fakeUser = this._fakeRegisteredUsers.find( user => user.email === signData.email )

		if ( signData.authProvider === 'email' && !fakeUser ) {
			signData.email = 'fail'
		}

		return this.signUp( signData )
	}

	onAuthStateChange( onChange: ( userCredentials: UserCredentials )=>void ) {
		this.notifyChange = onChange
		this.notifyChange( this._loggedUser )
	}

	async logout(): Promise<void> {
		const promise = new Promise<void>( resolve => {
			this._loggedUser = undefined
			resolve() 
			this.notifyChange( undefined )
		})
		this.pendingPromises.push( promise )
		return promise
	}

	resetEmailPassword( email: string ) {
		const fakeUserExists = this._fakeRegisteredUsers.find( user => user.email === email )

		if ( fakeUserExists ) return Promise.resolve()
		else return Promise.reject({ code: 'userNotFound', message: 'Test auth error' })
	}

	linkAdditionalProvider( provider: AuthProvider ): Promise<unknown> {
		throw new Error('Not implemented.')
	}
	
	unlinkProvider( provider: AuthProvider ): Promise<unknown> {
		throw new Error('Not implemented.')
	}
	
	async flush() {
		await Promise.all(this.pendingPromises)
    this.pendingPromises = []
	}

	fakeRegisteredUser( userCredentials: UserCredentials ) {
		this._fakeRegisteredUsers.push( userCredentials )
		return this
	}

	private userCredentials( signData: SignData ): UserCredentials {
		const fakeUser = this._fakeRegisteredUsers.find( user => user.email === signData.email )
		if ( fakeUser ) {
			return { ...fakeUser }
		}
		else {
			return ({
				id: signData.authProvider || `testUID${ signData.email? '-' + signData.email : '' }`,
				email: signData.email || 'testEmail',
				name: signData.authProvider || `testName${ signData.email? ' ' + signData.email : '' }` ,
				phoneNumber: 'testPhone',
				customData: {
					role: 'test'
				},
				lastLogin: 0,
				creationDate: 0
			})
		}
	}

	private pendingPromises: Promise<any>[] = []
	private _loggedUser: UserCredentials
	private notifyChange: ( userCredentials: UserCredentials ) => void
	private _fakeRegisteredUsers: UserCredentials[] = []
}