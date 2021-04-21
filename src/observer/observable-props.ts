import { Callback, Observable } from '../observer/observable'
import { ClassProps } from '../types/utility-types'

type PropChangeEvent<T> = Partial<ClassProps<T>>
type PropChangeCallback<T> = Callback<PropChangeEvent<T>>

export class ObservableProps {
	onChange( cb: PropChangeCallback<this> ) {
		this._onChange.subscribe( cb )
	}

	removeOnChange( cb: PropChangeCallback<this> ) {
		this._onChange.unsubscribe( cb )
	}

	changeProp<P extends keyof this>( propName: P, value: this[ P ] ): boolean {
		const pName = '_' + propName;

		if ( this[ pName ] !== value ) {
			this[ pName ] = value;
			this._onChange.notify({ [ propName ]: value });
			return true;
		}

		return false;
	}

	/**
	 * Calls the underlying Observable notification mechanism. This is needed when
	 * we want events be typed in derived classes
	 * 
	 * @param event a valid event from a derived class
	 */
	notify<T extends ObservableProps>( event: PropChangeEvent<T> ) {
		this._onChange.notify(event)
	}

	protected _onChange: Observable<PropChangeEvent<ObservableProps>> = new Observable<PropChangeEvent<ObservableProps>>()
}