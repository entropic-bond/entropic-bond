// The project tsconfig lists only `vitest/globals` in `types`, so Node's `fs`
// typings are not part of the program: the import is typed for this source scan.
// @ts-expect-error -- '@types/node' is not in the tsconfig `types` array
import { readFileSync } from 'fs'
import { CachedPropsUpdater, JsonDataSource, persistent, persistentReferenceWithCachedProps, Persistent, registerPersistentClass, Store } from '..'
import { UpdatedResults } from './cached-props-updater'

/**
 * End-to-end mirror of `samples/08-cached-props.ts`. It lives in its own file
 * because registering these classes in `cached-props-updater.spec.ts` would add
 * a `Team` watch key to every updater built in that file and break its exact
 * `collectionsToWatch` expectation.
 */
@registerPersistentClass( 'Team' )
class Team extends Persistent {
	set name( value: string | undefined ) { this._name = value }
	get name(): string | undefined { return this._name }

	set location( value: string | undefined ) { this._location = value }
	get location(): string | undefined { return this._location }

	@persistent private _name: string | undefined
	@persistent private _location: string | undefined
}

@registerPersistentClass( 'Employee' )
class Employee extends Persistent {
	set name( value: string | undefined ) { this._name = value }
	get name(): string | undefined { return this._name }

	@persistentReferenceWithCachedProps<Team>( ['name'], 'Team' )
	private _team: Team | undefined
	get team(): Team | undefined { return this._team }
	set team( value: Team | undefined ) { this._team = value }

	@persistent private _name: string | undefined
}

const SAMPLE_PATH = new URL( '../../samples/08-cached-props.ts', import.meta.url )

describe( '08-cached-props sample', ()=>{
	let datasource: JsonDataSource
	let updater: CachedPropsUpdater
	let updates: UpdatedResults[]

	beforeEach(()=>{
		datasource = new JsonDataSource()
		updates = []
		// install is the only wiring: no caller-side document-template listener
		updater = datasource.installCachedPropsUpdater()
		updater.afterDocumentChange = results => updates.push( results ?? {} )
		Store.useDataSource( datasource )
	})

	const updatedReports = () => updates.filter( report => Object.values( report ).some( result => result.updatedDocuments.length > 0 ))

	it( 'Show a cached-prop refresh in the cached-props sample without a bridge. Issue: #14 [REQ-21]', async ()=>{
		const team = new Team()
		team.name = 'Platform'
		team.location = 'Remote'

		const employee = new Employee()
		employee.name = 'Bob'
		employee.team = team

		const teamModel = Store.getModel<Team>( 'Team' )
		const employeeModel = Store.getModel<Employee>( 'Employee' )
		await teamModel.save( team )
		await employeeModel.save( employee )

		const newName = 'Platform Core'
		team.name = newName
		await teamModel.save( team )

		await vi.waitFor(()=> expect( updatedReports() ).toHaveLength( 1 ))

		const storedEmployee = ( await employeeModel.findById( employee.id ) )!
		expect( storedEmployee.team?.name ).toBe( newName )

		// the sample registers no listener: installing the updater is the only wiring
		const sampleSource = readFileSync( SAMPLE_PATH, 'utf-8' )
		expect( sampleSource ).toContain( 'installCachedPropsUpdater' )
		expect( sampleSource ).not.toContain( 'onDocumentTemplateChange' )
		expect( sampleSource ).toMatch( /updater\.afterDocumentChange\s*=/ )
		expect( sampleSource ).not.toMatch( /onDocumentChange|onCollectionChange/ )
	})
})
