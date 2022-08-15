import { CloudFunction, CloudFunctionsService } from './cloud-functions'

interface FunctionCollection { 
	[key: string]: CloudFunction<any,any>
}

export class CloudFunctionsMock implements CloudFunctionsService {
	constructor( registeredFunctions: FunctionCollection ) {
		this._registeredFunctions = registeredFunctions
	}

	getFunction<P, R>( cloudFunction: string ): CloudFunction<P,R> {
		return this._registeredFunctions[ cloudFunction ]
	}

	private _registeredFunctions: FunctionCollection
}