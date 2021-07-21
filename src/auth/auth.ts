import { Observable } from '../observable/observable'
import { SignData, UserCredential } from "./user-auth-types"

export interface CredentialProviders<T> {
	[ name: string ]: ( signData: SignData ) => Promise<T>
}

abstract class AuthServiceBase {
	abstract signUp( signData: SignData ): Promise<UserCredential>
	abstract login( signData: SignData ): Promise<UserCredential>
	abstract logout(): Promise<void>
	abstract onAuthStateChange( onChange: (userCredential: UserCredential) => void ): void
}

export abstract class AuthService<T> extends AuthServiceBase {
	registerCredentialProvider( name: string, providerFactory: ( singData?: SignData ) => Promise<T> ) {
		this.credentialProviders[ name ] = providerFactory		
	}
	readonly credentialProviders: CredentialProviders<T> = {}
}

export enum AuthErrorCode { 'auth/wrong-password', 'auth/popup-closed-by-user' }

export class Auth {
	protected constructor() {
		if (!Auth._authService ) throw (new Error('You should register an auth service before using Auth.'))
		Auth._authService.onAuthStateChange( 
			userCredentials => this.authStateChanged( userCredentials ) 
		)
	}

	static registerAuthService( authService: AuthServiceBase ) {
		if ( Auth._authService != authService ) {
			Auth._authService = authService
			this._instance = undefined
		}
	}

	static get instance() {
		return this._instance || (this._instance = new this() )
	}

	signUp( singData: SignData ): Promise<UserCredential> {
		return Auth._authService.signUp( singData )
	}

	login( singData: SignData ): Promise<UserCredential> {
		return Auth._authService.login( singData )
	}
	
	logout(): Promise<void> {
		return Auth._authService.logout()
	}

	onAuthStateChange( onChange: ( userCredential: UserCredential )=>void ) {
		return this._onAuthStateChange.subscribe( onChange )
	}

	removeAuthStateChange( onChange: ( userCredential: UserCredential )=>void ) {
		this._onAuthStateChange.unsubscribe( onChange )
	}

	private authStateChanged( userCredential: UserCredential ) {
		this._onAuthStateChange.notify( userCredential )
	}

	private static _instance: Auth = null
	private static _authService: AuthServiceBase
	private _onAuthStateChange: Observable<UserCredential> = new Observable<UserCredential>()
}