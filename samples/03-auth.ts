import { Auth, AuthMock } from '../src'

async function main() {
  Auth.useAuthService(new AuthMock())

  Auth.instance.onAuthStateChange(credentials => {
    console.log('Auth state:', credentials?.email ?? 'logged out')
  })

  const user = await Auth.instance.login({
    authProvider: 'email',
    email: 'user@test.com',
    password: '123456'
  })
  console.log('Logged in:', user.id, user.email)

  await Auth.instance.logout()
  console.log('Logged out')
}

main()
