import { Callback, Observable } from '../observable/observable';
import { ClassProps } from '../types/utility-types';
import { Persistent } from './persistent';

export type PropChangeEvent<T> = Partial<ClassProps<T>>
export type PropChangeCallback<T> = Callback<PropChangeEvent<T>>

export class ObservablePersistent extends Persistent {

	/**
	 * Subscribes a listener callback function. Every time a property is changed, 
	 * the listener callback will be called with the property change event.
	 * 
	 * @param listenerCallback the listener callback
	 * @returns a reference to the passed listener callback 
	 */
	onChange( listenerCallback: PropChangeCallback<this> ) {
		this._onChange.subscribe( listenerCallback )
		return listenerCallback
	}

	/**
	 * Removes the listener callback subscrition from the notifications.
	 * 
	 * @param listenerCallback the listener callback to remove
	 */
	removeOnChange( listenerCallback: PropChangeCallback<this> ) {
		this._onChange.unsubscribe( listenerCallback )
	}

	/**
	 * Changes the value of the property and notifies the subcribers about the change.
	 * This is a helper method that can be used in the property setter.
	 * 
	 * @param propName the name of the property to be changed
	 * @param value the new value for the property
	 * @returns true in case the property has been effectively changed, false otherwise
	 */
	protected changeProp<P extends keyof this>( propName: P, value: this[ P ] ): boolean {
		const pName = '_' + propName;

		if ( this[ pName ] !== value ) {
			this[ pName ] = value;
			this._onChange.notify({ [ propName ]: value });
			return true;
		}

		return false;
	}

	/**
	 * Notifies the subscribers a property or group of properties change.
	 * This is a helper function to be used when you want to notify property changes.
	 * 
	 * @param event the event with the changed properties
	 */
	protected notify<T extends ObservablePersistent>( event: PropChangeEvent<T> ) {
		this._onChange.notify(event)
	}

	private _onChange: Observable<PropChangeEvent<ObservablePersistent>> = new Observable<PropChangeEvent<ObservablePersistent>>()
}