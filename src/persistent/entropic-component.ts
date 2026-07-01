import { Callback, Observable, Unsubscriber } from '../observable/observable'
import { ClassArrayPropNames, ClassProps, Elements } from '../types/utility-types'
import { Persistent } from './persistent'

export type PropChangeEvent<T> = Partial<ClassProps<T>>
export type PropChangeCallback<T> = Callback<PropChangeEvent<T>>
type ArrayPropsElem<T> = Elements<T[ClassArrayPropNames<T>]>
type ArrayElementType<T extends Array<any>> = T[number];
export type CompareFunction<T> = ( a: T, b: T )=>boolean

/**
 * Derived classes from EntropicComponent will have the ability to notify 
 * property changes by calling one of the provided notification methods.
 * It extends Persistent class therefore EntropicComponent children will have
 * persistence through the Entropic Bond persistence mechanism
 */
export type StrictElement<T> = T extends any ? (keyof T extends never ? never : T) : never

export class EntropicComponent extends Persistent {

	/**
	 * Subscribes a listener callback function. Every time a property is changed, 
	 * the listener callback will be called with the property change event.
	 * 
	 * @param listenerCallback the listener callback
	 * @returns a function to unsubscribe the listener from further notifications
	 */
	onChange( listenerCallback: PropChangeCallback<this> ): Unsubscriber {
		return this._onChange.subscribe( listenerCallback )
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
	 * Changes the value of the property and notifies the subscribers about the change.
	 * This is a helper method that can be used in the property setter.
	 * 
	 * @param propName the name of the property to be changed
	 * @param value the new value for the property
	 * @returns true in case the property has been effectively changed, false otherwise
	 */
	protected changeProp<P extends keyof this>( propName: P, value: this[ P ] ): boolean {
		const pName = '_' + String( propName );

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
	protected notify<T extends EntropicComponent>( event: PropChangeEvent<T> ) {
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
	 * 									value will be	pushed into the array. When the function is 
	 * 									not provided, the element will be inserted regardless it is
	 * 									already in the array.
	 * @returns the inserted element or undefined if the element was not inserted.
	 */
	protected pushAndNotify<T extends keyof this, E>( 
		this: Record<T, readonly E[]> & EntropicComponent,
		arrayPropName: T, 
		element: StrictElement<E>, 
		isUnique?: CompareFunction<StrictElement<E>> 
	): E | undefined {

		const pName = '_' + String(arrayPropName)
		const array = this[pName]! as StrictElement<E>[]

		if (isUnique && array.find(item => !isUnique(item, element))) return undefined

		array.push(element)
		
		this.notify({ [arrayPropName]: this[arrayPropName] } as PropChangeEvent<EntropicComponent>)
		
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
	protected removeAndNotify<T extends keyof this, E>( 
		this: Record<T, readonly E[]> & EntropicComponent,
		arrayPropName: T, 
		element: StrictElement<E>, 
		isEqual: CompareFunction<StrictElement<E>>
	): E | undefined {

		const pName = '_' + String(arrayPropName)
		const array = this[pName]! as StrictElement<E>[]
		const originalLength = array.length

		const filtered = array.filter(item => !isEqual(item, element))
		const target = this as unknown as Record<string, unknown>
		target[pName] = filtered

		if (originalLength === filtered.length) return undefined

		this.notify({ [arrayPropName]: this[arrayPropName] } as PropChangeEvent<EntropicComponent>)

		return element
	}

	private _onChange: Observable<PropChangeEvent<EntropicComponent>> = new Observable<PropChangeEvent<EntropicComponent>>()
}