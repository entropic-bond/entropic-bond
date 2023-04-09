import { Observable } from '../observable/observable'
import { AuthProvider, SignData, UserCredentials } from "./user-auth-types"

/**
 * The AuthService class is an abstract class that defines the interface of an authentication service.
 * You should derive from this class to implement your own authentication service.
 */
export abstract class AuthService {
	abstract signUp<T extends {}>( signData: SignData ): Promise<UserCredentials<T>>
	abstract login<T extends {}>( signData: SignData ): Promise<UserCredentials<T>>
	abstract logout(): Promise<void>
	abstract resetEmailPassword( email: string ): Promise<void>
	abstract linkAdditionalProvider( provider: AuthProvider ): Promise<unknown>
	abstract unlinkProvider( provider: AuthProvider ): Promise<unknown>
	abstract onAuthStateChange<T extends {}>( onChange: (userCredentials: UserCredentials<T> | undefined) => void ): void
}

export type AuthErrorCode = 'wrongPassword' | 'popupClosedByUser' | 'userNotFound' | 'invalidEmail' | 'missingPassword' | 'missingEmail'

export interface AuthError {
	code: AuthErrorCode
	message: string
}

/**
 * Types the callback to accept a user credentials object
 */
export type ResovedCallback<T extends {}> = ( credentials: UserCredentials<T> ) => void
export type RejectedCallback = ( reason: AuthError ) => void

/**
 * The Auth class is a singleton that provides a unified interface to the authentication service.
 * You should register an authentication service by using `Auth.useAuthService` 
 * method before using the Auth class.
 */
export class Auth extends AuthService {
	static error = { shouldBeRegistered: 'You should register an auth service before using Auth.' }

	protected constructor() {
		super()
		if (!Auth._authService ) throw ( new Error( Auth.error.shouldBeRegistered ) )
		Auth._authService.onAuthStateChange( 
			userCredentials => this.authStateChanged( userCredentials ) 
		)
	}

	/**
	 * Registers an authentication service to be used by the Auth class.
	 * You need to register an authentication service before using the Auth class.
	 * @param authService the authentication service to be used by the Auth class
	 */
	static useAuthService( authService: AuthService ) {
		if ( Auth._authService != authService ) {
			Auth._authService = authService
			this._instance = undefined
		}
	}

	/**
	 * The instance of the Auth class
	 * @returns the authentication service
	 */
	static get instance() {
		return this._instance || (this._instance = new this() )
	}

	/**
	 * Signs up a new user
	 * @param singData the data to be used to sign up the user
	 * @returns a promise that resolves to the user credentials
	 * @example
	 * // Sign up a new user with email and password
	 * Auth.instance.signUp({ authProvider: 'email', email: 'john@test.com', password: '123456' })
	 * // Sign up a new user with a Google account
	 * Auth.instance.signUp({ authProvider: 'google'})
	 */
	signUp<T extends {}>( singData: SignData ): Promise<UserCredentials<T>> {
		return Auth._authService.signUp( singData )
	}

	/**
	 * Logs in an existing user
	 * @param singData the data to be used to log in the user
	 * @returns a promise that resolves to the user credentials
	 * @example
	 * // Log in an existing user with email and password
	 * Auth.instance.login({ authProvider: 'email', email: 'john@test.com', password: '123456' })
	 * // Log in an existing user with a Google account
	 * Auth.instance.login({ authProvider: 'google'})
	 */
	login<T extends {}>( singData: SignData ): Promise<UserCredentials<T>> {
		return Auth._authService.login( singData )
	}
	
	/**
	 * Logs out the current user
	 * @returns a promise that resolves when the user is logged out
	 */
	logout(): Promise<void> {
		return Auth._authService.logout()
	}

	/**
	 * Resets the password associated with the email.
	 * @param email the email address of the user to reset the password
	 * @returns a promise that resolves when the process is done
	 */
	resetEmailPassword( email: string ) {
		return Auth._authService.resetEmailPassword( email )
	}

	/**
	 * Adds a listener to be called when the authentication state changes.
	 * @param onChange the listener to be called when the authentication state changes.
	 * The listener is called with the user credentials as a parameter.
	 * If the user is logged out, the listener is called with `undefined` as a parameter.
	 * @returns a function to remove the listener
	 * @example
	 * // Add a listener to be called when the authentication state changes
	 * const removeListener = Auth.instance.onAuthStateChange( userCredentials => {
	 * 	if ( userCredentials ) {
	 * 		// The user is logged in
	 * 	} else {
	 * 		// The user is logged out
	 * 	}
	 * })
	 */
	onAuthStateChange<T extends {}>( onChange: ( userCredentials: UserCredentials<T> )=>void ) {
		return this._onAuthStateChange.subscribe( onChange )
	}

	/**
	 * Removes a listener that was added by `onAuthStateChange` method.
	 * @param onChange the listener to be removed
	 */
	removeAuthStateChange<T extends {}>( onChange: ( userCredentials: UserCredentials<T> )=>void ) {
		this._onAuthStateChange.unsubscribe( onChange )
	}

	/**
	 * Links an additional authentication provider to the authenticated user.
	 * @param provider the provider to be linked
	 * @returns a promise that resolves when the process is done
	 * @example
	 * // Link a Google account to the auth service
	 * Auth.instance.linkAdditionalProvider({ authProvider: 'google' })
	 */
	linkAdditionalProvider( provider: AuthProvider ): Promise<unknown> {
		return Auth._authService.linkAdditionalProvider( provider )
	}

	/**
	 * Unlinks an authentication provider from the authenticated user.
	 * @param provider the provider to be unlinked
	 * @returns a promise that resolves when the process is done
	 * @example
	 * // Unlink the Google account from the auth service
	 * Auth.instance.unlinkProvider({ authProvider: 'google' })
	 */
	unlinkProvider( provider: AuthProvider ): Promise<unknown> {
		return Auth._authService.unlinkProvider( provider )
	}

	private authStateChanged( userCredentials: UserCredentials<{}> | undefined ) {
		this._onAuthStateChange.notify( userCredentials )
	}

	private static _instance: Auth | undefined = undefined
	private static _authService: AuthService
	private _onAuthStateChange: Observable<UserCredentials<{}>> = new Observable<UserCredentials<{}>>()
}