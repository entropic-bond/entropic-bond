import { Callback, Observable } from '../observable/observable';
import { ClassArrayPropNames, ClassArrayProps, ClassPropNames, ClassProps, Elements } from '../types/utility-types';
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

	/**
	 * Inserts a new element in the arrayPropName member array. To keep all the 
	 * elements unique, pass a function to in the isUnique parameter. If the
	 * elements is successfully inserted, a notification with a property change event
	 * will be fired.
	 * 
	 * @param arrayPropName the name of the array property of T where to insert the
	 * 											new element.
	 * @param value the element value to be inserted
	 * @param isUnique a function that checks for inequity of the two elements passed 
	 * 							as parameter. If the returned value is true, the value wil be
	 * 							pushed into the array. 
	 * @returns the inserted element or undefined if the element was not inserted
	 */
	pushElement<T extends ObservablePersistent>( 
		arrayPropName: ClassArrayPropNames<T>, 
		value: Elements<T[ClassArrayPropNames<T>]>, 
		isUnique?: ( a: Elements<T[ClassArrayPropNames<T>]>, b: Elements<T[ClassArrayPropNames<T>]> )=>boolean 
	): Elements<T[ClassArrayPropNames<T>]> {

		const pName = '_' + arrayPropName;
		const alreadyIn = isUnique && this[ pName ].find( 
			( element: Elements<T[ClassArrayPropNames<T>]> ) => !isUnique( element, value ) 
		)
		if ( alreadyIn ) return undefined

		this[ pName ].push( value )
		this.notify({ [arrayPropName]: this[ arrayPropName as string ] })
		return value
	}

	removeElement( is?: number ){}

	private _onChange: Observable<PropChangeEvent<ObservablePersistent>> = new Observable<PropChangeEvent<ObservablePersistent>>()
}