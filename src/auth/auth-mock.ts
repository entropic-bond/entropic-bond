import { Collection } from '../types/utility-types'
import { AuthService, RejectedCallback, ResovedCallback } from "./auth"
import { UserCredentials, SignData, AuthProvider } from "./user-auth-types"

export class AuthMock extends AuthService {

	signUp<T extends {}>( signData: SignData ): Promise<UserCredentials<T>> {
		const { verificationLink, email, password, authProvider } = signData
	
		const promise = new Promise<UserCredentials<T>>( async ( resolve: ResovedCallback<T>, reject: RejectedCallback ) => {
			if ( authProvider === 'email' ) {
				if ( !email ) reject({ code: 'missingEmail', message: 'missingEmail' })
				if ( !password ) reject({ code: 'missingPassword', message: 'missingPassword' })
			}
			if ( password !== 'fail' && email !== 'fail' ) {
				this._loggedUser = this.userCredentials<T>( signData )
				this._fakeRegisteredUsers[ this._loggedUser.id ] = this._loggedUser 
				resolve( this._loggedUser as UserCredentials<T> )
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

	login<T extends {}>( signData: SignData ): Promise<UserCredentials<T>> {
		const fakeUser = Object.values( this._fakeRegisteredUsers ).find( 
			user => user.email === signData.email 
		)

		if ( signData.authProvider === 'email' && !fakeUser && signData.email) {
			signData.email = 'fail'
		}

		return this.signUp( signData )
	}

	onAuthStateChange<T extends {}>( onChange: ( userCredentials: UserCredentials<T> )=>void ) {
		this.notifyChange = onChange
		this.notifyChange( this._loggedUser )
	}

	async logout(): Promise<void> {
		const promise = new Promise<void>( resolve => {
			this._loggedUser = undefined
			resolve() 
			this.notifyChange?.( undefined )
		})
		this.pendingPromises.push( promise )
		return promise
	}

	resetEmailPassword( email: string ) {
		const fakeUserExists = Object.values( this._fakeRegisteredUsers ).find( 
			user => user.email === email 
		)

		if ( fakeUserExists ) return Promise.resolve()
		else return Promise.reject({ code: 'userNotFound', message: 'Test auth error' })
	}

	resendVerificationEmail( email: string, _password: string, _verificationLink: string ) {
		const fakeUserExists = Object.values( this._fakeRegisteredUsers ).find( 
			user => user.email === email 
		)

		if ( fakeUserExists ) return Promise.resolve()
		else return Promise.reject({ code: 'userNotFound', message: 'Test auth error' })
	}

	override refreshToken(): Promise<void> {
		return Promise.resolve()
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

	fakeRegisteredUser<T extends {}>( userCredentials: UserCredentials<T> ) {
		if ( this._fakeRegisteredUsers[ userCredentials.id ] ) throw new Error( `User with id ${ userCredentials.id } already exists in fake user list`)
		this._fakeRegisteredUsers[ userCredentials.id ] = userCredentials
		return this
	}

	get fakeRegisteredUsers() {
		return this._fakeRegisteredUsers
	}

	private userCredentials<T extends {}>( signData: SignData ): UserCredentials<T> {
		const fakeUser = Object.values( this._fakeRegisteredUsers ).find( 
			user => user.email === signData.email 
		)
		
		if ( fakeUser ) {
			return { ...fakeUser as UserCredentials<T> }
		}
		else {
			return ({
				id: signData.authProvider || `testUID${ signData.email? '-' + signData.email : '' }`,
				email: signData.email || 'testEmail',
				name: signData.authProvider || `testName${ signData.email? ' ' + signData.email : '' }` ,
				phoneNumber: 'testPhone',
				customData: {
					role: 'test'
				} as unknown as T,
				lastLogin: 0,
				creationDate: 0
			} as UserCredentials<T>)
		}
	}

	private pendingPromises: Promise<any>[] = []
	private _loggedUser: UserCredentials<{}> | undefined
	private notifyChange: (( userCredentials: UserCredentials<{}> | undefined ) => void ) | undefined
	private _fakeRegisteredUsers: Collection<UserCredentials<{}>> = {}
}