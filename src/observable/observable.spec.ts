import {Observable} from './observable'

class ObserverTest {
	public changed: boolean = true
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
		const changedSpy = vi.spyOn( mockObserver, 'userChanged' )
		
		observable.subscribe( ()=>mockObserver.userChanged() )
		observable.notify()
		
		expect( changedSpy ).toBeCalledTimes(1)
	})
	
	it('should notify', ()=>{
		const myCallback = vi.fn()

		observable.subscribe( myCallback )
		observable.notify()

		expect( myCallback ).toHaveBeenCalledTimes(1)
	})

	it('should notify all subscribers', () => {
		const callbackOne = vi.fn()
		const callbackTwo = vi.fn()
		const callbackThree = vi.fn()
		observable.subscribe(callbackOne)
		observable.subscribe(callbackTwo)
		observable.subscribe(callbackThree)
		
		observable.notify()

		expect(callbackOne).toHaveBeenCalledTimes(1)
		expect(callbackTwo).toHaveBeenCalledTimes(1)
		expect(callbackThree).toHaveBeenCalledTimes(1)
	})

	it( 'should notify with event', ()=>{
		const myCallback = vi.fn()
		const obj: MockEvent = {name: 'Juan'};

		observable.subscribe( myCallback )
		observable.notify(obj)

		expect( myCallback ).toHaveBeenCalledWith( obj )
	})

	it('should not notify removed listeners', ()=>{
		const callbackOne = vi.fn()
		const callbackTwo = vi.fn()
		const callbackThree = vi.fn()
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

	it( 'should return an unsubscribe function on subscribe', ()=>{
		const cb = vi.fn()
		const unsubscriber = observable.subscribe( cb )	
		unsubscriber()

		observable.notify()
		expect( cb ).not.toHaveBeenCalled()
	})
	
	it( 'should return the number of subscribers', ()=>{
		const cb = vi.fn()
		observable.subscribe( cb )
		observable.subscribe( cb )
		observable.subscribe( vi.fn() )

		expect( observable.subscribersCount ).toBe( 2 )
	})
})