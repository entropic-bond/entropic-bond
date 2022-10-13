import { Auth } from './auth'
import { AuthMock } from './auth-mock'
import { UserCredentials } from './user-auth-types'

interface CustomCredentials {
	role: string
	customer: string
}

describe( 'Auth Mock', ()=>{
	let authChangeSpy = jest.fn()
	let mockAuthService: AuthMock
	const fakeUseCredentials = {
		email: 'fakeUser@test.com',
		emailVerified: true,
		creationDate: new Date( '2017-01-01' ).getDate(),
		lastLogin: new Date( '2017-01-03' ).getDate(),
		customData: {
			role: 'testRole',
			customer: 'testCustomer'
		},
		id: 'fakeUser',
	} as UserCredentials<CustomCredentials>

	beforeEach(()=>{
		Auth.useAuthService( mockAuthService = new AuthMock() )
		Auth.instance.onAuthStateChange( authChangeSpy ) 

		mockAuthService.fakeRegisteredUser( fakeUseCredentials )

	})

	it( 'should throw if AuthService not set', ()=>{
		Auth.useAuthService( undefined )
		expect(
			()=>Auth.instance
		).toThrow( Auth.error.shouldBeRegistered )
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
				authProvider: 'email',
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
			id: fakeUseCredentials.id
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
	
	it( 'should throw if email does not exists in resetEmailPassword', async ()=>{
		return expect(
			Auth.instance.resetEmailPassword( 'non-existing-email@test.com' )
		).rejects.toEqual( expect.objectContaining({ code: 'userNotFound' }) )
	})

	it( 'should retrieve custom credentials', async ()=>{
		const userCredentials = await Auth.instance.login<CustomCredentials>({
			email: 'fakeUser@test.com',
			password: 'password',
			authProvider: 'google'
		})

		expect( userCredentials.customData.role ).toEqual( 'testRole' )
	})
	
})