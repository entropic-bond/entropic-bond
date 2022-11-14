import { Observable } from '../observable/observable'
import { AuthProvider, SignData, UserCredentials } from "./user-auth-types"

export abstract class AuthService {
	abstract signUp<T extends {}>( signData: SignData ): Promise<UserCredentials<T>>
	abstract login<T extends {}>( signData: SignData ): Promise<UserCredentials<T>>
	abstract logout(): Promise<void>
	abstract resetEmailPassword( email: string ): Promise<void>
	abstract linkAdditionalProvider( provider: AuthProvider ): Promise<unknown>
	abstract unlinkProvider( provider: AuthProvider ): Promise<unknown>
	abstract onAuthStateChange<T extends {}>( onChange: (userCredentials: UserCredentials<T>) => void ): void
}

export type AuthErrorCode = 'wrongPassword' | 'popupClosedByUser' | 'userNotFound' | 'invalidEmail' | 'missingPassword'

export interface AuthError {
	code: AuthErrorCode
	message: string
}

export type ResovedCallback<T extends {}> = ( credentials: UserCredentials<T> ) => void
export type RejectedCallback = ( reason: AuthError ) => void

export class Auth extends AuthService {
	static error = { shouldBeRegistered: 'You should register an auth service before using Auth.' }

	protected constructor() {
		super()
		if (!Auth._authService ) throw ( new Error( Auth.error.shouldBeRegistered ) )
		Auth._authService.onAuthStateChange( 
			userCredentials => this.authStateChanged( userCredentials ) 
		)
	}

	static useAuthService( authService: AuthService ) {
		if ( Auth._authService != authService ) {
			Auth._authService = authService
			this._instance = undefined
		}
	}

	static get instance() {
		return this._instance || (this._instance = new this() )
	}

	signUp<T extends {}>( singData: SignData ): Promise<UserCredentials<T>> {
		return Auth._authService.signUp( singData )
	}

	login<T extends {}>( singData: SignData ): Promise<UserCredentials<T>> {
		return Auth._authService.login( singData )
	}
	
	logout(): Promise<void> {
		return Auth._authService.logout()
	}

	resetEmailPassword( email: string ) {
		return Auth._authService.resetEmailPassword( email )
	}

	onAuthStateChange<T extends {}>( onChange: ( userCredentials: UserCredentials<T> )=>void ) {
		return this._onAuthStateChange.subscribe( onChange )
	}

	removeAuthStateChange<T extends {}>( onChange: ( userCredentials: UserCredentials<T> )=>void ) {
		this._onAuthStateChange.unsubscribe( onChange )
	}

	linkAdditionalProvider( provider: AuthProvider ): Promise<unknown> {
		return Auth._authService.linkAdditionalProvider( provider )
	}

	unlinkProvider( provider: AuthProvider ): Promise<unknown> {
		return Auth._authService.unlinkProvider( provider )
	}

	private authStateChanged( userCredentials: UserCredentials<{}> ) {
		this._onAuthStateChange.notify( userCredentials )
	}

	private static _instance: Auth = null
	private static _authService: AuthService
	private _onAuthStateChange: Observable<UserCredentials<{}>> = new Observable<UserCredentials<{}>>()
}