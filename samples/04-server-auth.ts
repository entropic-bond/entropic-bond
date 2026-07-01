import { ServerAuth, ServerAuthMock } from '../src'

async function main() {
  ServerAuth.useServerAuthService(new ServerAuthMock({
    'user-1': { id: 'user-1', email: 'admin@test.com' }
  }))

  const user = await ServerAuth.instance.getUser('user-1')
  console.log('User:', user)

  await ServerAuth.instance.updateUser('user-1', { name: 'Updated Name' })

  await ServerAuth.instance.deleteUser('user-1')
  console.log('User deleted')
}

main()
