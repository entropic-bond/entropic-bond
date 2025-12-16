import { JsonDataSource } from './json-data-source'
import { DerivedUser, SubClass, TestUser, UsesUserAsPersistentProp } from './mocks/test-user'
import { Model } from './model'
import { Store } from './store'
import testData from './mocks/mock-data.json'
import { DataSource, DocumentChangeListenerHandler } from './data-source'
import { Persistent } from '../persistent/persistent'
import { Unsubscriber } from '../observable/observable'
import { Mock } from 'vitest'

describe( 'Model', ()=>{
	let model: Model< TestUser >
	let testUser: TestUser
	const rawData = ()=> ( Store.dataSource as JsonDataSource ).rawData 

	beforeEach( async ()=> {
		Store.useDataSource( new JsonDataSource( structuredClone( testData ) ) )
		
		testUser = new TestUser()
		testUser.name = {
			firstName: 'testUserFirstName',
			lastName: 'testUserLastName',
			ancestorName: {}
		}
		testUser.age = 35
		testUser.skills = [ 'lazy', 'dirty' ]
		
		model = Store.getModel<TestUser>( 'TestUser' )
	})

	it( 'should get model from class name string and class instance', ()=>{
		expect( 
			Store.getModel( testUser ).collectionName 
		).toEqual( model.collectionName )

		expect( model.collectionName ).toEqual( 'TestUser' )
	})

	it( 'should find document by id', async ()=>{
		const user = await model.findById( 'user1' )

		expect( user ).toBeInstanceOf( TestUser )
		expect( user?.id ).toEqual( 'user1' )
		expect( user?.name?.firstName ).toEqual( 'userFirstName1' )
	})

	it( 'should not throw if a document id doesn\'t exists', ()=>{
		expect( async ()=>{
			await model.findById( 'nonExistingId' )
		}).not.toThrow()
	})
	
	it( 'should return undefined if a document id doesn\'t exists', async ()=>{
		expect( await model.findById( 'nonExistingId' ) ).toBeUndefined()
	})
	
	it( 'should return empty array if no document matches condition', async ()=>{
		expect( await model.find().where( 'age', '<', 0 ).get() ).toHaveLength( 0 )
	})

	it( 'should return all documents if no where specified', async ()=>{
		const docs = await model.find().get()
		expect( docs.length ).toBeGreaterThan( 1 )
	})
	
	it( 'should write a document', async ()=>{
		await model.save( testUser )

		expect( rawData()[ 'TestUser' ]?.[ testUser.id ] ).toEqual(	expect.objectContaining({ 
			name: { 
				firstName: 'testUserFirstName',
				lastName: 'testUserLastName',
				ancestorName: {}
			}
		}))
	})	
	
	it( 'should delete a document by id', async ()=>{
		expect( rawData()[ 'TestUser' ]?.[ 'user1'] ).toBeDefined()
		await model.delete( 'user1' )

		expect( rawData()[ 'TestUser' ]?.[ 'user1' ] ).toBeUndefined()
	})

	describe( 'Generic find', ()=>{
		it( 'should query all admins with query object', async ()=>{
			const admins = await model.query({
				operations: [{
					property: 'admin',
					operator: '==',
					value: true
				}]
			})

			expect( admins[0] ).toBeInstanceOf( TestUser )
			expect( admins ).toHaveLength( 2 )
		})

		it( 'should query by instance', async ()=>{
			expect( await model.query({}) ).toHaveLength( 6 )
			expect( await model.query({}, new DerivedUser() ) ).toHaveLength( 1 )
			expect( await model.query({}, 'TestUser' ) ).toHaveLength( 5 )
		})
		
		it( 'should find all admins with where methods', async ()=>{
			const admins = await model.find().where( 'admin', '==', true ).get()

			expect( admins[0] ).toBeInstanceOf( TestUser )
			expect( admins ).toHaveLength( 2 )
		})

		it( 'should query by subproperties', async ()=>{
			const users = await model.query({
				operations: [
					{
						property: 'name',
						operator: '==',
						value: { firstName: 'userFirstName3' }
					},
					{ property: 'age', operator: '!=', value: 134	}
				]
			})

			expect( users[0]?.id ).toBe( 'user3' )
		})

		it( 'should find by subproperties', async ()=>{
			const users = await model.find()
				.where( 'name', '==', { firstName: 'userFirstName3' })
				.get()

			expect( users[0]?.id ).toBe( 'user3' )
		})
		
		it( 'should find by property path', async ()=>{
			const users = await model.find()
				.whereDeepProp( 'name.firstName', '==', 'userFirstName3' )
				.get()

				expect( users[0]?.id ).toBe( 'user3' )
		})
		
		it( 'should find by superdeep property path', async ()=>{
			const users = await model.find()
				.whereDeepProp( 'name.ancestorName.father', '==', 'user3Father')
				.get()

			expect( users[0]?.id ).toEqual( 'user3' )
		})

		it( 'should find by swallow property path', async ()=>{
			const users = await model.find()
				.whereDeepProp( 'age', '==', 21 )
				.get()

			expect( users[0]?.id ).toEqual( 'user2' )
		})

		it( 'should return the whole collection on undefined query object', async ()=>{
			const users = await model.query()

			expect( users ).toHaveLength( 6 )
		})

		it( 'should return the whole collection on empty query object', async ()=>{
			const users = await model.query({})

			expect( users ).toHaveLength( 6 )
		})
		
	})

	describe( 'Derived classes should fit on parent collection', ()=>{

		it( 'should save derived object in parent collection', async ()=>{
			const derived = new DerivedUser()
			derived.name = { firstName: 'Fulanito', lastName: 'Derived', ancestorName: {} }
			derived.salary = 3900

			await model.save( derived )

			expect( rawData()[ 'TestUser' ]?.[ derived.id ]?.[ 'salary' ] ).toBe( 3900 )
			expect( rawData()[ 'TestUser' ]?.[ derived.id ]?.[ '__className' ] ).toEqual( 'DerivedUser' )
		})

		it( 'should retrieve derived object by id ', async ()=>{
			const derived = await model.findById<DerivedUser>( 'user4' )

			expect( derived ).toBeInstanceOf( DerivedUser )
			expect( ( derived as DerivedUser ).salary ).toBe( 2800 )
		})

		it( 'should find instances of derived classes', async ()=>{
			const derived = await model.find().instanceOf<DerivedUser>( 'DerivedUser' ).get()

			expect( derived[0] ).toBeInstanceOf( DerivedUser )
			expect( ( derived[0] as DerivedUser ).salary ).toBe( 2800 )
		})
		
	})

	describe( 'References to documents', ()=>{
		let ref1: SubClass, ref2: SubClass

		beforeEach( async ()=>{
			testUser.documentRef = new SubClass()
			testUser.documentRef.year = 2045	
			ref1 = new SubClass(); ref1.year = 2081
			ref2 = new SubClass(); ref2.year = 2082
			testUser.manyRefs.push( ref1 )
			testUser.manyRefs.push( ref2 )
			testUser.derived = new DerivedUser()
			testUser.derived.salary = 1350
			testUser.manyDerived = [ new DerivedUser(), new DerivedUser() ]
			testUser.manyDerived[0]!.salary = 990
			testUser.manyDerived[1]!.salary = 1990
			await model.save( testUser )
		})

		it( 'should save a document as a reference', async ()=>{
			expect( rawData()[ 'SubClass' ] ).toBeDefined()
			expect( rawData()[ 'SubClass' ]?.[ testUser.documentRef!.id ] ).toEqual(
				expect.objectContaining({
					__className: 'SubClass',
					year: 2045
				})
			)
		})
		
		it( 'should read a swallow document reference', async ()=>{
			const loadedUser = await model.findById( testUser.id )

			expect( loadedUser?.documentRef ).toBeInstanceOf( SubClass )
			expect( loadedUser?.documentRef?.id ).toBeDefined()
			expect( loadedUser?.documentRef?.year ).toBeUndefined()
		})

		it( 'should fill data of swallow document reference', async ()=>{
			const loadedUser = await model.findById( testUser.id )

			await Store.populate( loadedUser?.documentRef! )
			expect( loadedUser?.documentRef?.id ).toBeDefined()
			expect( loadedUser?.documentRef?.year ).toBe( 2045 )
		})

		it( 'should save and array of references', ()=>{
			expect( rawData()[ 'SubClass' ]?.[ ref1.id ] ).toBeDefined()
			expect( rawData()[ 'SubClass' ]?.[ ref1.id ]?.[ 'year'] ).toBe( 2081 )			
			expect( rawData()[ 'SubClass' ]?.[ ref2.id ] ).toBeDefined()
			expect( rawData()[ 'SubClass' ]?.[ ref2.id ]?.[ 'year'] ).toBe( 2082 )			
		})

		it( 'should read an array of references', async ()=>{
			const loadedUser = await model.findById( testUser.id )
			
			expect( loadedUser?.manyRefs ).toHaveLength( 2 )
			expect( loadedUser?.manyRefs[0] ).toBeInstanceOf( SubClass )
			expect( loadedUser?.manyRefs[0]?.id ).toEqual( testUser.manyRefs[0]!.id )
			expect( loadedUser?.manyRefs[0]?.year ).toBeUndefined()
			expect( loadedUser?.manyRefs[1] ).toBeInstanceOf( SubClass )
			expect( loadedUser?.manyRefs[1]?.id ).toEqual( testUser.manyRefs[1]!.id )
			expect( loadedUser?.manyRefs[1]?.year ).toBeUndefined()
		})

		it( 'should fill array of refs', async ()=>{
			const loadedUser = await model.findById( testUser.id )
			await Store.populate( loadedUser?.manyRefs! )

			expect( loadedUser?.manyRefs[0]?.year ).toBe( 2081 )
			expect( loadedUser?.manyRefs[1]?.year ).toBe( 2082 )
		})

		it( 'should save a reference when declared @persistentAt', async ()=>{
			const loadedUser = await model.findById( testUser.id )

			expect( loadedUser?.derived?.id ).toEqual( testUser.derived!.id )
			expect( loadedUser?.derived?.salary ).toBeUndefined()

			await Store.populate( loadedUser?.derived! )

			expect( loadedUser?.derived?.salary ).toBe( 1350 )
			expect( loadedUser?.derived?.id ).toBe( testUser.derived!.id )
		})

		it( 'should populate from special collection when declared with @persistentRefAt', async ()=>{
			const loadedUser = await model.findById( 'user6' )
			await Store.populate( loadedUser?.derived! )

			expect( loadedUser?.derived?.salary ).toBe( 2800 )
			expect( loadedUser?.derived?.id ).toBe( 'user4' )
		})
		
		it( 'should save a reference when declared @persistentAt as array', async ()=>{
			const loadedUser = await model.findById( testUser.id )

			expect( loadedUser?.manyDerived[0]?.id ).toEqual( testUser.manyDerived[0]!.id )
			expect( loadedUser?.manyDerived[0]?.salary ).toBeUndefined()
			expect( loadedUser?.manyDerived[1]?.salary ).toBeUndefined()

			await Store.populate( loadedUser?.manyDerived! )

			expect( loadedUser?.manyDerived[0]?.salary ).toBe( 990 )
			expect( loadedUser?.manyDerived[0]?.id ).toBe( testUser.manyDerived[0]!.id )
			expect( loadedUser?.manyDerived[1]?.salary ).toBe( 1990 )
			expect( loadedUser?.manyDerived[1]?.id ).toBe( testUser.manyDerived[1]!.id )
		})

		it( 'should not overwrite not filled ref in collection', async ()=>{
			const loadedUser = await model.findById( 'user6' )
			await model.save( loadedUser! )
			const refInCollection = await model.findById<DerivedUser>( 'user4' )

			expect( refInCollection?.salary ).toBe( 2800 )
		})

		it( 'should save loaded ref with assigned new instance', async ()=>{
			const loadedUser = await model.findById( 'user6' )
			loadedUser!.derived = new DerivedUser()
			loadedUser!.derived.salary = 345
			await model.save( loadedUser! )

			const refInCollection = await model.findById<DerivedUser>( loadedUser!.derived.id )
			expect( refInCollection?.salary ).toBe( 345 )
		})

		it( 'should save loaded ref with modified ref data', async ()=>{
			const loadedUser = await model.findById( 'user6' )
			await Store.populate( loadedUser?.derived! )
			loadedUser!.derived!.salary = 1623
			await model.save( loadedUser!! )

			const refInCollection = await model.findById<DerivedUser>( 'user4' )
			expect( refInCollection?.salary ).toBe( 1623 )
		})

		it( 'should find by object ref', async ()=>{
			const loadedDerived = await model.findById( 'user4' )
			const loadedUser = await model.find().where( 'derived', '==', loadedDerived! ).get()

			expect( loadedUser[0]?.id ).toEqual( 'user6' )
		})

		it( 'should not throw on calling populate several times on same object', async ()=>{
			const loadedUser = await model.findById( 'user6' )
			await Store.populate( loadedUser?.derived! )
			expect( loadedUser?.derived?.['_documentRef'] ).not.toBeDefined()
			let thrown = false

			try {
				await Store.populate( loadedUser?.derived! )
			} 
			catch ( err ) {
				thrown = true
			}
			expect( thrown ).toBeFalsy()
		})

		it( 'should not throw on populating undefined instances', async ()=>{
			const loadedUser = await model.findById( 'user6' )
			loadedUser!.derived = undefined as any
			let thrown = false
	
			try {
				await Store.populate( loadedUser?.derived! )
			} 
			catch ( err ) {
				thrown = true
			}
			expect( thrown ).toBeFalsy()
		})

		it( 'should not throw on populating non existing reference', async ()=>{
			const loadedUser = await model.findById( 'user6' )

			loadedUser!.derived![ '_id' ] = 'non-existing'
			let thrown = false

			try {
				await Store.populate( loadedUser?.derived! )
			} 
			catch ( err ) {
				thrown = true
			}
			expect( thrown ).toBeFalsy()
		})

		it( 'should remove deleted references when populating from the returned array', async ()=>{
			const loadedUser = await model.findById( testUser.id )
			const deletedId = loadedUser?.manyDerived[0]?.id
			await model.delete( deletedId! )

			const manyDerived = await Store.populate( loadedUser?.manyDerived! )

			expect( manyDerived[0]?.id ).not.toBe( deletedId )
			expect( manyDerived ).toHaveLength( 1 )
		})

		it( 'should report if populated for single reference', async ()=>{
			const loadedUser = await model.findById( 'user6' )
			expect( Store.isPopulated( loadedUser?.derived! ) ).toBeFalsy()

			await Store.populate( loadedUser?.derived! )
			expect( Store.isPopulated( loadedUser?.derived! ) ).toBeTruthy()
		})
		
		it( 'should report if populated for multiple references', async ()=>{
			const loadedUser = await model.findById( testUser.id )

			expect( Store.isPopulated( loadedUser?.manyDerived! ) ).toBeFalsy()

			await Store.populate( loadedUser?.manyDerived! )
			expect( Store.isPopulated( loadedUser?.manyDerived! ) ).toBeTruthy()
		})
		
	})

	describe( 'Operations on queries', ()=>{
		it( 'should limit the result set', async ()=>{
			const unlimited = await model.find().get()
			const limited = await model.find().limit( 2 ).get()

			expect( unlimited.length ).not.toBe( limited.length )
			expect( limited ).toHaveLength( 2 )
		})

		it( 'should sort ascending the result set', async ()=>{
			const docs = await model.find().orderBy( 'age' ).get()

			expect( docs[0]?.id ).toEqual( 'user2' )
			expect( docs[1]?.id ).toEqual( 'user1' )
		})
		
		it( 'should sort descending the result set', async ()=>{
			const docs = await model.find().orderBy( 'age', 'desc' ).get()

			expect( docs[0]?.id ).toEqual( 'user3' )
			expect( docs[1]?.id ).toEqual( 'user5' )
		})

		it( 'should sort by deep property path', async ()=>{
			const docs = await model.find().orderByDeepProp( 'name.firstName', 'desc' ).get()

			expect( docs[0]?.id ).toEqual( 'user6' )
			expect( docs[1]?.id ).toEqual( 'user5' )
		})
		
		it( 'should sort by swallow property path', async ()=>{
			const docs = await model.find().orderByDeepProp( 'age' ).get()

			expect( docs[0]?.id ).toEqual( 'user2' )
			expect( docs[1]?.id ).toEqual( 'user1' )
		})
		
		it( 'should count the documents in the collection', async ()=>{
			expect( await model.find().count() ).toBe( 6 )
		})
	})

	describe( 'Compound queries', ()=>{
		it( 'should find documents using `AND` compound query', async ()=>{
			const admins = await model.find()
				.where( 'admin', '==', true )
				.where( 'age', '<', 50 )
				.get()

			expect( admins ).toHaveLength( 1 )
			expect( admins[0]?.age ).toBeLessThan( 50 )
		})

		it( 'should find using `OR` query', async ()=>{
			const docs = await model.find().or( 'age', '==', 23 ).or( 'age', '==', 41 ).get()

			expect( docs ).toHaveLength( 2 )
			expect( docs ).toEqual( expect.arrayContaining([
				expect.objectContaining({ id: 'user1', age: 23 }),
				expect.objectContaining({ id: 'user5', age: 41 })
			]))
		})

		it( 'should find combining `OR` query and `where` query', async ()=>{
			const docs = await model.find().where( 'age', '>', 50 ).or( 'age', '==', 23 ).or( 'age', '==', 41 ).get()

			expect( docs ).toHaveLength( 3 )
			expect( docs ).toEqual( expect.arrayContaining([
				expect.objectContaining({ id: 'user1', age: 23 }),
				expect.objectContaining({ id: 'user5', age: 41 }),
				expect.objectContaining({ id: 'user3', age: 56 })
			]))
		})

		it( 'should find combining `OR` query and `where` query in a range', async ()=>{
			const docs = await model.find().where( 'age', '<', 22 ).or( 'age', '>', 50 ).get()

			expect( docs ).toHaveLength( 2 )
			expect( docs ).toEqual( expect.arrayContaining([
				expect.objectContaining({ id: 'user2', age: 21 }),
				expect.objectContaining({ id: 'user3', age: 56 })
			]))
		})

		it( 'should throw if a `where` query is used after an `or` query', ()=>{
			expect( 
				()=> model.find().or( 'age', '==', 23 ).where( 'age', '>', 50 )
			).toThrow( Model.error.invalidQueryOrder )
		})

		it( 'should evaluate mixing operands', async ()=>{
			const docs = await model.find().where( 'age', '>', 39 ).and( 'age', '<', 57 ).or( 'age', '==', 23 ).or( 'age', '==', 21 ).get()
			expect( docs ).toHaveLength( 5 )
			expect( docs ).toEqual( expect.arrayContaining([
				expect.objectContaining({ id: 'user1', age: 23 }),
				expect.objectContaining({ id: 'user2', age: 21 }),
				expect.objectContaining({ id: 'user3', age: 56 }),
				expect.objectContaining({ id: 'user5', age: 41 }),
				expect.objectContaining({ id: 'user6', age: 40 })
			]))

			const docs1 = await model.find().where( 'age', '==', 41 ).and( 'age', '==', 56 ).or( 'age', '==', 23 ).or( 'age', '==', 21 ).get()
			expect( docs1 ).toHaveLength( 2 )
			expect( docs1 ).toEqual( expect.arrayContaining([
				expect.objectContaining({ id: 'user1', age: 23 }),
				expect.objectContaining({ id: 'user2', age: 21 })
			]))

			const docs2 = await model.find().where( 'age', '==', 41 ).or( 'age', '==', 56 ).or( 'age', '==', 23 ).or( 'age', '==', 21 ).get()
			expect( docs2 ).toHaveLength( 4 )
			expect( docs2 ).toEqual( expect.arrayContaining([
				expect.objectContaining({ id: 'user1', age: 23 }),
				expect.objectContaining({ id: 'user2', age: 21 }),
				expect.objectContaining({ id: 'user3', age: 56 }),
				expect.objectContaining({ id: 'user5', age: 41 })
			]))
		})
	})

	describe( 'Searchable array property', ()=>{
		it( 'should save searchable array property', async ()=>{
			const user = new TestUser( 'user7' )
			user.colleagues = [ new TestUser( 'cUser1' ), new TestUser( 'cUser2' ) ]
			await model.save( user )

			const loadedUser = await model.findById( 'user7' )
			expect( loadedUser?.colleagues ).toHaveLength( 2 )
			expect( loadedUser![ Persistent.searchableArrayNameFor( 'colleagues' )] ).toBeUndefined()
			const rawUserSearchableContent = rawData()[ 'TestUser' ]!['user7']![Persistent.searchableArrayNameFor( 'colleagues' )]
			expect( rawUserSearchableContent ).toEqual([ 'cUser1', 'cUser2' ])
		})

		it( 'should find documents using `containsAny` operator', async ()=>{
			const colleague1 = new TestUser( 'colleague1' )
			const colleague2 = new TestUser( 'colleague2' )
			const docs = await model.find().where( 'colleagues', 'containsAny', [ colleague1, colleague2 ]).get()

			expect( docs ).toHaveLength( 3 )
			expect( docs ).toEqual([
				expect.objectContaining({ id: 'user2' }),
				expect.objectContaining({ id: 'user4' }),
				expect.objectContaining({ id: 'user6' })
			])
		})

		it( 'should find documents using `contains` operator', async ()=>{
			const colleague2 = new TestUser( 'colleague2' )
			const docs = await model.find().where( 'colleagues', 'contains', colleague2 ).get()

			expect( docs ).toHaveLength( 2 )
			expect( docs ).toEqual([
				expect.objectContaining({ id: 'user4' }),
				expect.objectContaining({ id: 'user6' })
			])
		})
	})

	describe( 'Data Cursors', ()=>{
		beforeEach( async ()=>{
			await model.find().get( 2 )
		})

		it( 'should get next result set', async ()=>{
			const docs = await model.next()
			expect( docs ).toHaveLength( 2 )
			expect( docs[0]?.id ).toEqual( 'user3' )
		})
		
		it( 'should not go beyond the end of result set', async ()=>{
			await model.next()
			await model.next()
			const docs = await model.next()
			expect( docs ).toHaveLength( 0 )
		})
	})

	describe( 'Utility methods', ()=>{
		
		it( 'should transform query object operations to property path', ()=>{
			const operations = DataSource.toPropertyPathOperations<TestUser>([
				{
					property: 'name',
					operator: '==',
					value: { ancestorName: { father: 'Felipe' }}
				},
				{
					property: 'age',
					operator: '==',
					value: 23
				}
			])

			expect( operations[0] ).toEqual({
				property: 'name.ancestorName.father',
				operator: '==',
				value: 'Felipe'
			})

			expect( operations[1] ).toEqual({
				property: 'age',
				operator: '==',
				value: 23
			})
		})

	})

	describe( 'SubCollections', ()=>{
		let subCollectionModel: Model<SubClass>

		beforeEach(async ()=>{
			const user = await model.findById( 'user1' )
			subCollectionModel = Store.getModelForSubCollection<SubClass>( user!, 'SubClass' )
		})
		
		it( 'should get model for subCollection', ()=>{
			const model = Store.getModelForSubCollection<SubClass>( testUser, 'SubClass' )
			expect( model.collectionName ).toEqual( `TestUser/${ testUser.id }/SubClass` )
		})

		it( 'should find subCollection document by id', async ()=>{
			const subClass = await subCollectionModel.findById( 'subClass1' )

			expect( subClass ).toBeInstanceOf( SubClass )
			expect( subClass?.year ).toBe( 1326 )
		})

		it( 'should save data to subCollection', async ()=>{
			const subClass = new SubClass()
			subClass.year = 3452

			await subCollectionModel.save( subClass )
			const loaded = await subCollectionModel.findById( subClass.id )

			expect( loaded?.year ).toBe( 3452 )
		})
		
	})

	describe( 'Data source listeners', ()=>{
		let listenerHandlers: DocumentChangeListenerHandler[]

		beforeEach(()=>{
			listenerHandlers = Store.dataSource.installCachedPropsUpdaters()
		})

		afterEach(()=>{
			listenerHandlers.forEach( handler => handler.uninstall() )
		})

		it( 'should update when a document is changed', async ()=>{
			const userModel = Store.getModel<TestUser>( 'TestUser' )
			const user1 = ( await userModel.findById( 'user1' ) )!
			user1.age = 99
			user1.admin = false
			await userModel.save( user1 )

			const referenceModel = Store.getModel<UsesUserAsPersistentProp>( 'UsesUserAsPersistentProp' )
			const reference = ( await referenceModel.findById( 'usesUserAsPersistentProp1' ) )!
			expect( reference.user?.age ).toBe( 99 )
			expect( reference.user?.admin ).toBeFalsy()
		})

	})


	describe( 'Collection and document listeners', ()=>{
		let unsubscribeDocumentListener: Unsubscriber
		let unsubscribeCollectionListener: Unsubscriber
		let documentListener: Mock
		let collectionListener: Mock

		beforeEach(()=>{
			documentListener = vi.fn()
			collectionListener = vi.fn()

			unsubscribeDocumentListener = model.onDocumentChange( 'user1', documentListener)

			const query = model.find().where( 'age', '==', 23 )
			unsubscribeCollectionListener = model.onCollectionChange( query, collectionListener)
		})

		afterEach(()=>{
			unsubscribeDocumentListener()
			unsubscribeCollectionListener()
		})

		it( 'should call document listener when assigned document changes', async ()=>{
			model.save( new TestUser( 'user1' ) )
			expect( documentListener ).toBeCalledTimes( 1 )
			expect( documentListener ).toBeCalledWith({ 
				after: expect.objectContaining({ id: 'user1' }),
				before: expect.objectContaining({ id: 'user1' }),
				collectionPath: 'TestUser',
				params: {},
				type: 'update'
			})
		})

		it( 'should not call document listener when other document changes', async ()=>{
			model.save( new TestUser( 'user234' ) )
			expect( documentListener ).not.toBeCalled()
		})

		it( 'should call collection listener when a document in the query changes', async ()=>{
			const modUser = await model.findById( 'user1' )
			modUser!.skills = []
			model.save( modUser! )

			expect( collectionListener ).toBeCalledTimes( 1 )
			expect( collectionListener ).toBeCalledWith({ 
				after: expect.objectContaining({ id: 'user1' }),
				before: expect.objectContaining({ id: 'user1' }),
				collectionPath: 'TestUser',
				params: {},
				type: 'update'
			})
		})

		it( 'should not call collection listener when a document out of the query changes', async ()=>{
			const modUser = await model.findById( 'user2' )
			modUser!.skills = []
			model.save( modUser! )

			expect( collectionListener ).not.toBeCalled()
		})
	})


	it('should pass Type tests', ()=>{
		//@ts-expect-error
		()=>model.find().whereDeepProp( 'not-prop', '==', 'userFirstName3' )
		expect( true ).toBeTruthy()
	})
})
