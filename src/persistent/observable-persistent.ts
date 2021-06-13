import { Callback, Observable } from '../observable/observable';
import { ClassArrayPropNames, ClassProps, Elements } from '../types/utility-types';
import { Persistent } from './persistent';

export type PropChangeEvent<T> = Partial<ClassProps<T>>
export type PropChangeCallback<T> = Callback<PropChangeEvent<T>>
type ArrayPropsElem<T> = Elements<T[ClassArrayPropNames<T>]>
export type CompareFunction<T> = ( a: ArrayPropsElem<T>, b: ArrayPropsElem<T> )=>boolean

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
	 * Inserts a new element in an arbitrary array property of this class and 
	 * fires a change event if successfully inserted. To avoid repeated elements
	 * to be inserted, you can pass a function that checks for inequity.
	 * 
	 * @param arrayPropName the name of the array property of this class where you
	 * 											want to insert the	new element.
	 * @param element the element to be inserted
	 * @param isUnique a function that checks for inequity of the two elements 
	 * 									passed as parameter. If the returned value is true, the 
	 * 									value will be	pushed into the array. 
	 * @returns the inserted element or undefined if the element was not inserted.
	 */
	protected pushElement<T extends ObservablePersistent>( 
		arrayPropName: ClassArrayPropNames<T>, 
		element: ArrayPropsElem<T>, 
		isUnique?: CompareFunction<T> 
	): ArrayPropsElem<T> {

		const pName = '_' + arrayPropName;
		const alreadyIn = isUnique && this[ pName ].find( 
			( item: ArrayPropsElem<T> ) => !isUnique( item, element ) 
		)
		if ( alreadyIn ) return undefined

		this[ pName ].push( element )
		this.notify({ [arrayPropName]: this[ arrayPropName as string ] })
		return element
	}

	/**
	 * Removes an element from an arbitrary array property of this class and fires
	 * a change event on operation success.
	 * 
	 * @param arrayPropName the name of the array property of this class where you
	 * 											want to insert the	new element.
	 * @param element the element to be inserted
	 * @param isEqual a function that checks for equity of the two elements 
	 * 									passed as parameter. If the returned value is true, the 
	 * 									value will be	removed from the array. 
	 * @returns the removed element or undefined if the element was not removed.
	 */
	protected removeElement<T extends ObservablePersistent>( 
		arrayPropName: ClassArrayPropNames<T>, 
		element: ArrayPropsElem<T>,
		isEqual: CompareFunction<T>
	): ArrayPropsElem<T> {

		const pName = '_' + arrayPropName;

		const originalLength = this[ pName ].length

		this[ pName ] = this[ pName ].filter( 
			( item: ArrayPropsElem<T> ) => !isEqual( item, element ) 
		)

		if ( originalLength === this[ pName ].length ) {
			return undefined
		}

		this.notify({ [arrayPropName]: this[ arrayPropName as string ] })
		return element
	}

	private _onChange: Observable<PropChangeEvent<ObservablePersistent>> = new Observable<PropChangeEvent<ObservablePersistent>>()
}