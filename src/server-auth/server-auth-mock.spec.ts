import { ServerAuth } from './server-auth'
import { ServerAuthMock } from './server-auth-mock'

describe( 'Server Auth Mock', ()=>{

	beforeEach(()=>{
		ServerAuth.useServerAuthService( new ServerAuthMock({
			testUser1: { id: 'testUser1', email: 'testUser1@acme.com', customData: { a: 'aCustomData' }}
		}))
	})

	it( 'should get user credentials', async ()=>{
		const user = await ServerAuth.instance.getUser( 'testUser1' )
		expect( user.email ).toEqual( 'testUser1@acme.com' )
	})
	
	it( 'should set custom credentials', async ()=>{
		await ServerAuth.instance.setCustomCredentials( 'testUser1', {
			a: 'anotherTestCustomData'
		})
		
		const user = await ServerAuth.instance.getUser( 'testUser1' )
		expect( user.email ).toEqual( 'testUser1@acme.com' )
		expect( user.customData.a ).toEqual( 'anotherTestCustomData' )

	})

	it( 'should throw if user does not exists when setting custom claims', ()=>{
		expect(
			()=>ServerAuth.instance.setCustomCredentials( 'nonExistingUser', {
				a: 'anotherTestCustomData'
			})
		).toThrow( /not found/ )
		expect.assertions(1)
	})
	
	it( 'should update user credentials from non existing user', async ()=>{
		await ServerAuth.instance.updateUser( 'nonExistingUser', {
			id: 'nonExistingUser',
			email: 'nonExistingUser@acme.com',
			customData: { a: 'aTestCustomData' }
		})

		const user = await ServerAuth.instance.getUser( 'nonExistingUser' )
		expect( user.email ).toEqual( 'nonExistingUser@acme.com' )
		expect( user.customData.a ).toEqual( 'aTestCustomData' )
	})
})