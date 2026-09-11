import {
  Persistent, persistent, persistentReference,
  registerPersistentClass, JsonDataSource, Store
} from '../src'

@registerPersistentClass('Team')
class Team extends Persistent {
  set name(value: string | undefined) { this._name = value }
  get name(): string | undefined { return this._name }
  @persistent private _name: string | undefined
}

@registerPersistentClass('User')
class User extends Persistent {
  set name(value: string | undefined) { this._name = value }
  get name(): string | undefined { return this._name }

  set email(value: string | undefined) { this._email = value }
  get email(): string | undefined { return this._email }

  set team(value: Team | undefined) { this._team = value }
  get team(): Team | undefined { return this._team }

  @persistent private _name: string | undefined
  @persistent private _email: string | undefined
  @persistentReference private _team: Team | undefined
}

async function main() {
  Store.useDataSource(new JsonDataSource())

  const team = new Team()
  team.name = 'Engineering'

  const user = new User()
  user.name = 'Alice'
  user.email = 'alice@example.com'
  user.team = team

  const userModel = Store.getModel<User>('User')
  const teamModel = Store.getModel<Team>('Team')

  await teamModel.save(team)
  await userModel.save(user)

  const found = await userModel.findById(user.id)
  console.log('Found user:', found?.name)

  const results = await userModel.find()
    .where('name', '==', 'Alice')
    .limit(10)
    .get()
  console.log('Query results:', results.length)

  await userModel.delete(user.id)
}

main()
