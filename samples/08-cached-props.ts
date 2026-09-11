import {
  Persistent, persistent, registerPersistentClass,
  persistentReferenceWithCachedProps, CachedPropsUpdater,
  DataSource, Store, JsonDataSource
} from '../src'

@registerPersistentClass('Team')
class Team extends Persistent {
  set name(value: string | undefined) { this._name = value }
  get name(): string | undefined { return this._name }

  set location(value: string | undefined) { this._location = value }
  get location(): string | undefined { return this._location }

  @persistent private _name: string | undefined
  @persistent private _location: string | undefined
}

@registerPersistentClass('Employee')
class Employee extends Persistent {
  set name(value: string | undefined) { this._name = value }
  get name(): string | undefined { return this._name }

  @persistentReferenceWithCachedProps<Team>(['name'], 'Team')
  private _team: Team | undefined
  get team(): Team | undefined { return this._team }
  set team(value: Team | undefined) { this._team = value }

  @persistent private _name: string | undefined
}

async function main() {
  const ds = new JsonDataSource()
  ds.installCachedPropsUpdater()
  Store.useDataSource(ds)

  const team = new Team()
  team.name = 'Platform'
  team.location = 'Remote'

  const employee = new Employee()
  employee.name = 'Bob'
  employee.team = team

  const teamModel = Store.getModel<Team>('Team')
  const empModel = Store.getModel<Employee>('Employee')

  await teamModel.save(team)
  await empModel.save(employee)
  console.log('Saved with cached props')
}

main()
