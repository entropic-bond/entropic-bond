export type Callback<T> = ( event: T ) => void
export type Unsubscriber = ()=>void

/**
 * Implements the Observer pattern.
 * The Observable class is used to notify a list of subscribers when an event occurs.
 * The subscribers are callback functions that are called when the event occurs.
 * The event is passed as a parameter to the callback function.
 * @example
 * // Create an observable
 * const observable = new Observable<number>()
 * // Subscribe a listener
 * const unsubscribe = observable.subscribe( event => console.log( event ) )
 * // Notify the subscribers
 * observable.notify( 1 )
 * // Unsubscribe the listener
 * unsubscribe()
 */
export class Observable<T> {

	/**
	 * Subscribes a listener callback function. On every notification, 
	 * the listener callback will be called with an event as a parameter if sent.
	 * 
	 * @param callback the listener callback
	 * @returns a function to unsubscribe the listener from further notifications
	 */
	 subscribe( callback: Callback<T> ): Unsubscriber {
		this.subscribers.add(callback)
		return ()=>this.unsubscribe( callback )
	}

	/**
	 * Removes the callback from the notification list.
	 * 
	 * @param listenerCallback the listener callback to remove
	 */
	unsubscribe( callback: Callback<T> ) {
		this.subscribers.delete( callback )
	}

	/**
	 * Notifies all the subscribers with the event passed as parameter.
	 * 
	 * @param event the event passed to all subscribers.
	 */
	notify( event?: T ) {
		this.subscribers.forEach(subs => subs(event!))
	}

	/**
	 * Returns the number of subscribers.
	 * 
	 * @returns the number of subscribers
	 * @example
	 * const observable = new Observable<number>()
	 * observable.subscribe( event => console.log( event ) )
	 * observable.subscribe( event => console.log( event ) )
	 * observable.subscribe( event => console.log( event ) )
	 * console.log( observable.subscribersCount ) // 3
	 */
	get subscribersCount() {
		return this.subscribers.size
	}

	private subscribers: Set<Callback<T>> = new Set()
}