import { Auth } from './auth'
import { AuthMock } from './auth-mock'

describe( 'Auth Mock', ()=>{
	let authChangeSpy = jest.fn()
	let mockAuthService: AuthMock
	const fakeUseCredentials = {
		email: 'fakeUser@test.com',
		emailVerified: true,
		creationDate: new Date( '2017-01-01' ).getDate(),
		lastLogin: new Date( '2017-01-03' ).getDate(),
		customData: {},
		id: 'fakeUser',
	}

	beforeEach(()=>{
		Auth.registerAuthService( mockAuthService = new AuthMock() )
		Auth.instance.onAuthStateChange( authChangeSpy ) 

		mockAuthService.fakeRegisteredUser( fakeUseCredentials )

	})

	it( 'should emulate sign-up', async ()=>{
		const userCredentials = await Auth.instance.signUp({
			authProvider: 'google',
			email: 'test@test.com',
			password: 'password'
		})

		expect( userCredentials.email ).toEqual( 'test@test.com' )
		expect( authChangeSpy ).toHaveBeenCalledWith( userCredentials )
	})

	it( 'should emulate failed sign-up', async ()=>{
		try {
			var userCredentials = await Auth.instance.signUp({
				email: 'test@test.com',
				password: 'fail'
			})
		}
		catch {}

		expect( userCredentials ).toBeUndefined()
		expect( authChangeSpy ).toHaveBeenCalledWith( undefined )
	})

	it( 'should login with fake registered user', async ()=>{
		const userCredentials = await Auth.instance.login({
			email: 'fakeUser@test.com',
			password: 'password',
			authProvider: 'google'
		})

		const modUserCredentials = { 
			...fakeUseCredentials, 
			id: fakeUseCredentials.id + '__from_auth'
		}

		expect( userCredentials ).toEqual( modUserCredentials )
		expect( authChangeSpy ).toHaveBeenCalledWith( modUserCredentials )
	})

	it( 'should fail login with email auth provider if does not match fake user credentials', async ()=>{
		try {
			var userCredentials = await Auth.instance.login({
				email: 'test@test.com',
				password: 'password',
				authProvider: 'email'
			})
		} catch {}

		expect( userCredentials ).toEqual( undefined )
		expect( authChangeSpy ).toHaveBeenCalledWith( undefined )
	})
	
	it( 'should NOT fail login with non email auth provider even if does not match fake user credentials', async ()=>{
		const userCredentials = await Auth.instance.login({
			email: 'test@test.com',
			password: 'password',
			authProvider: 'google'
		})

		expect( userCredentials.email ).toEqual( 'test@test.com' )
		expect( authChangeSpy ).toHaveBeenCalledWith( undefined )
	})

	it( 'should logout', async ()=>{
		await Auth.instance.logout()

		expect( authChangeSpy ).toHaveBeenCalledWith( undefined )
	})
	
	
})