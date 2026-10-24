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

  // Installing is enough: the updater subscribes to the collections that hold
  // references with cached props, so no manual document-template listener bridge is needed.
  const updater: CachedPropsUpdater = ds.installCachedPropsUpdater({
    onRefreshFailure: (error, change) => {
      console.log(`Cached props refresh failed for ${change.collectionPath}`, error)
    }
  })
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

  // A refresh is asynchronous: await the updater's afterDocumentChange callback
  // to know it completed. The callback reports the owners touched by one
  // referenced-document change, so wait for the report that actually updated
  // the employee.
  const refreshed = new Promise<void>(resolve => {
    updater.afterDocumentChange = (updatedResults) => {
      const updated = Object.values(updatedResults ?? {}).some(result => result.updatedDocuments.length > 0)
      if (updated) resolve()
    }
  })

  const newName = 'Platform Core'
  team.name = newName
  await teamModel.save(team)
  await refreshed

  const storedEmployee = (await empModel.findById(employee.id))!
  const cachedTeamName = storedEmployee.team?.name
  console.log(`Employee ${storedEmployee.name} cached team name: ${cachedTeamName}`)

  if (cachedTeamName !== newName) throw new Error('The cached team name was not refreshed')
}

main()
