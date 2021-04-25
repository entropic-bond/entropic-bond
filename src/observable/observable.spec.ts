import {Observable} from './observable'

class ObserverTest {
		public changed: boolean
	userChanged() {
		this.changed = true
	}
}

interface MockEvent {
	[ idx: string ]: any
}

describe('observer', () => {
	let observable: Observable<MockEvent | void>

	beforeEach(()=>{
		observable = new Observable<MockEvent | void>()
	})

	it('should subscribe ', () => {
		const mockObserver = new ObserverTest();
		const changedSpy = jest.spyOn( mockObserver, 'userChanged' )
		
		const result = observable.subscribe(()=>mockObserver.userChanged()); 
		
		observable.notify()
		
		expect( changedSpy ).toBeCalledTimes(1)
	})
	
	it('should notify', ()=>{
		const myCallback = jest.fn()

		observable.subscribe( myCallback )
		observable.notify()

		expect( myCallback ).toHaveBeenCalledTimes(1)
	})

	it('should notify all subscribers', () => {
		const callbackOne = jest.fn()
		const callbackTwo = jest.fn()
		const callbackThree = jest.fn()
		observable.subscribe(callbackOne)
		observable.subscribe(callbackTwo)
		observable.subscribe(callbackThree)
		
		observable.notify()

		expect(callbackOne).toHaveBeenCalledTimes(1)
		expect(callbackTwo).toHaveBeenCalledTimes(1)
		expect(callbackThree).toHaveBeenCalledTimes(1)
	})
	it( 'should notify with event', ()=>{
		const myCallback = jest.fn()
		const obj: MockEvent = {name: 'Juan'};

		observable.subscribe( myCallback )
		observable.notify(obj)

		expect( myCallback ).toHaveBeenCalledWith( obj )
	})

	it('should not notify removed listeners', ()=>{
		const callbackOne = jest.fn()
		const callbackTwo = jest.fn()
		const callbackThree = jest.fn()
		observable.subscribe(callbackOne)
		observable.subscribe(callbackTwo)
		observable.subscribe(callbackThree)
		
		observable.notify()

		expect(callbackOne).toHaveBeenCalledTimes(1)
		expect(callbackTwo).toHaveBeenCalledTimes(1)
		expect(callbackThree).toHaveBeenCalledTimes(1)

		observable.unsubscribe( callbackThree )

		observable.notify()

		expect(callbackOne).toHaveBeenCalledTimes(2)
		expect(callbackTwo).toHaveBeenCalledTimes(2)
		expect(callbackThree).toHaveBeenCalledTimes(1)
	})

})