import { Persistent, PersistentObject } from '../persistent/persistent'


export type CloudFunction<P,R> = ( param?: P ) => Promise<R>

export interface CloudFunctionsService {
	retrieveFunction<P, R>( cloudFunction: string ): CloudFunction<P, R>
	callFunction<P,R>( func: CloudFunction<P, R>, params: P ): Promise<R>
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

	getFunction<P extends Persistent | undefined = undefined, R extends Persistent | undefined = undefined>( cloudFunction: string ): CloudFunction<P,R> {
		const callFunction = CloudFunctions._cloudFunctionsService.callFunction

		const func = CloudFunctions._cloudFunctionsService.retrieveFunction<P,R>( cloudFunction )
		return async ( param?: P ) => {
			const result = await callFunction<PersistentObject<P>,PersistentObject<R>>( func, param?.toObject() )
			if ( typeof result !== 'undefined' ) {
				return Persistent.createInstance( result ) as R
			}
		}
	}

	private static _cloudFunctionsService: CloudFunctionsService
	private static _instance: CloudFunctions
}