import { CloudFunction, CloudFunctionsService } from './cloud-functions'

interface FunctionCollection { 
	[key: string]: CloudFunction<any,any>
}

export class CloudFunctionsMock implements CloudFunctionsService {
	constructor( registeredFunctions: FunctionCollection ) {
		this._registeredFunctions = registeredFunctions
	}

	retrieveFunction<P, R>( cloudFunction: string ): CloudFunction<P,R> {
		return this._registeredFunctions[ cloudFunction ]
	}

	callFunction<P, R>( func: CloudFunction<P, R>, params: P ): Promise<R> {
		return func( params )
	}

	private _registeredFunctions: FunctionCollection
}