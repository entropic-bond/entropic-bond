import { AuthService, RejectedCallback, ResovedCallback } from "./auth"
import { UserCredentials, SignData } from "./user-auth-types"

export class AuthMock extends AuthService<UserCredentials> {
	constructor() {
		super()
		this.pendingPromises = []
	}

	signUp( signData: SignData ): Promise<UserCredentials> {
		const { authProvider, verificationLink, email } = signData
	
		const promise = new Promise<UserCredentials>( async ( resolve: ResovedCallback, reject: RejectedCallback ) => {
			if ( authProvider !== 'fail' && email !== 'fail' ) {
				this._loggedUser = this.userCredentials( signData )
				this.notifyChange?.( this._loggedUser )
				resolve( this._loggedUser )
			} 
			else {
				this.notifyChange?.( undefined )
				reject({ code: 'userNotFound', message: verificationLink || 'Test auth error' })
			}
		})
		this.pendingPromises.push( promise )
		return promise
	}

	login( signData: SignData ): Promise<UserCredentials> {
		if ( signData.authProvider === 'email' && signData.email !== this._fakeRegisteredUser?.email ) {
			signData.email = 'fail'
		}

		return this.signUp( signData )
	}

	onAuthStateChange( onChange: ( userCredentials: UserCredentials )=>void ) {
		this.notifyChange = onChange
		this.notifyChange( this._loggedUser )
	}

	async logout(): Promise<void> {
		this._loggedUser = undefined
		this.notifyChange( this._loggedUser )

		const promise = new Promise<void>( resolve => resolve() )
		this.pendingPromises.push( promise )
		return promise
	}

	async flush() {
		await Promise.all(this.pendingPromises)
    this.pendingPromises = []
	}

	fakeRegisteredUser( userCredentials: UserCredentials ) {
		this._fakeRegisteredUser = userCredentials
		return this
	}

	private userCredentials( signData: SignData ): UserCredentials {
		if ( this._fakeRegisteredUser ) {
			return { ...this._fakeRegisteredUser, email: signData.email }
		}
		else {
			return ({
				id: signData.authProvider || `testUID${ signData.email? '-' + signData.email : '' }`,
				email: signData.email || 'testEmail',
				name: signData.authProvider || `testName${ signData.email? ' ' + signData.email : '' }` ,
				phoneNumber: 'testPhone',
				customData: {
					gdprConsent: true,
					subscriptionPlan: 'user',
					planExpireDate: 0
				},
				lastLogin: 0,
				creationDate: 0
			})
		}
	}

	private pendingPromises: Promise<any>[]
	private _loggedUser: UserCredentials
	private notifyChange: ( userCredentials: UserCredentials ) => void
	private _fakeRegisteredUser: UserCredentials
}