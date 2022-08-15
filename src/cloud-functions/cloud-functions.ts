export type CloudFunction<P,R> = ( param?: P ) => Promise<R>

export interface CloudFunctionsService {
	getFunction<P, R>( cloudFunction: string ): CloudFunction<P,R>
}

export class CloudFunctions implements CloudFunctionsService {
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

	getFunction<P, R>( cloudFunction: string ): CloudFunction<P,R> {
		return CloudFunctions._cloudFunctionsService.getFunction( cloudFunction )
	}

	private static _cloudFunctionsService: CloudFunctionsService
	private static _instance: CloudFunctions
}