export type Callback<T> = ( event: T ) => void
export type Unsubscriber = ()=>void

export class Observable<T> {

	/**
	 * Subscribes a listener callback function. On every notification, 
	 * the listener callback will be called with an event as a parameter if sent.
	 * 
	 * @param callback the listener callback
	 * @returns a function to unsubscribe the listener from further notifications
	 */
	 subscribe( callback: Callback<T> ): Unsubscriber {
		this.subscribers.push(callback)
		return ()=>this.unsubscribe( callback )
	}

	/**
	 * Removes the callback from the notification list.
	 * 
	 * @param listenerCallback the listener callback to remove
	 */
	unsubscribe( callback: Callback<T> ) {
		this.subscribers = this.subscribers.filter( cb => cb !== callback )
	}

	/**
	 * Notifies all the subscribers with the event passed as parameter.
	 * 
	 * @param event the event passed to all subscribers.
	 */
	notify( event?: T ) {
		this.subscribers.forEach(subs => subs(event))
	}

	private subscribers: Callback<T>[] = []
}