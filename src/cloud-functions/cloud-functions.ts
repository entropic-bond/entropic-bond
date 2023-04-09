import { Persistent, PersistentObject } from '../persistent/persistent'


export type CloudFunction<P,R> = ( param?: P) => Promise<R>

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

	getFunction<P, R=void>( cloudFunction: string ): CloudFunction<P,R> {
		const callFunction = CloudFunctions._cloudFunctionsService.callFunction
		const func = this.getRawFunction<P, R>( cloudFunction )

		return async ( param: P ) => {
			const result = await callFunction( func, this.processParam( param ) )
			return this.processResult( result )
		}
	}

	private processParam<P>( param: P ): P | PersistentObject<P & Persistent> {
		if ( param === undefined || param === null ) return undefined!

		if ( param instanceof Persistent ) return param.toObject()

		if ( Array.isArray( param ) ) {
			return param.map( p => this.processParam( p ) ) as unknown as P
		}

		if ( typeof param === 'object' ) {
			return Object.entries( param ).reduce(( newParam, [ key, value ])=>{
				newParam[ key ] = this.processParam( value )
				return newParam
			}, {}) as P
		}

		return param
	}

	private processResult<R>( value: R | PersistentObject<R & Persistent> ): R {
		if ( value === undefined || value === null ) return undefined!

		if ( ( value as PersistentObject<R & Persistent> ).__className ) {
			return Persistent.createInstance( value as PersistentObject<R & Persistent> ) as R
		}

		if ( Array.isArray( value ) ) {
			return value.map( elem => this.processResult( elem ) ) as unknown as R
		}

		if ( typeof value === 'object' ) {
			return Object.entries( value ).reduce((newVal, [ key, val ]) => {
				newVal[ key ] = this.processResult( val )
				return newVal
			}, {}) as R
		}

		return value as R
	}

	private static _cloudFunctionsService: CloudFunctionsService
	private static _instance: CloudFunctions
}