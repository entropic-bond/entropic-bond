import { Persistent, PersistentObject } from '../persistent/persistent'


export type CloudFunction<P,R> = ( param?: P ) => Promise<R>

export interface CloudFunctionsService {
	// retrieveFunction<P extends Persistent | never, R extends Persistent>( cloudFunction: string ): CloudFunction<PersistentObject<P>, PersistentObject<R>>
	retrieveFunction<P, R>( cloudFunction: string ): CloudFunction<P, R>
}

export class CloudFunctions {
	private constructor() {}

	static error = { shouldBeRegistered: 'You should register a cloud functions service with useCloudFunctionsService static method before using CloudFunctions.' }

	static useCloudFunctionsService( cloudFunctionsService: CloudFunctionsService ) {
		if ( this._cloudFunctionsService != cloudFunctionsService ) {
			this._cloudFunctionsService = cloudFunctionsService
		}
	}

	static get instance() {
		if ( !this._cloudFunctionsService ) throw new Error( CloudFunctions.error.shouldBeRegistered )
		return CloudFunctions._instance || ( CloudFunctions._instance = new CloudFunctions() )
	}

	getRawFunction<P, R>( cloudFunction: string ): CloudFunction<P,R> {
		return CloudFunctions._cloudFunctionsService.retrieveFunction( cloudFunction )
	}

	getFunction<P extends Persistent | undefined = undefined, R extends Persistent | void = void>( cloudFunction: string ): CloudFunction<P,R> {
		const func = CloudFunctions._cloudFunctionsService.retrieveFunction( cloudFunction )
		return async ( param?: P ) => {
			const result = await func( param?.toObject() ) as R
			if ( result instanceof Persistent ) {
				return Persistent.createInstance( result ) as R
			}
		}
	}

	private static _cloudFunctionsService: CloudFunctionsService
	private static _instance: CloudFunctions
}