export type Callback<T> = ( event: T ) => void

export class Observable<T> {
	subscribe( callback: Callback<T> ) {
		this.subscribers.push(callback)
	}

	unsubscribe( callback: Callback<T> ) {
		this.subscribers = this.subscribers.filter( cb => cb !== callback )
	}

	notify( event?: T ) {
		this.subscribers.forEach(subs => subs(event))
	}

	private subscribers: Callback<T>[] = []
}