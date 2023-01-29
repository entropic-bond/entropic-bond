import { PropPath, PropPathType } from '../types/utility-types'

export interface Values {
	[ varName: string ]: string;
}

/**
 * Replaces keys found in a string for its values. The keys should be inserted 
 * inside brackets ${ key } as is done in the string template literals substitutions
 * @param text the string template
 * @param values an object with key-value pairs
 * @returns the string filled with corresponding values
 */
export function replaceValue( text: string, values: Values ): string {
	if ( !text ) return ''
	
	return text.replace(/\${\s*(\w*)\s*}/g, function( _match , group){
		return values[ group ] || '';
	});
}

/**
 * Transforms a string to a camel case format (camelCaseFormat)
 * @param str the string to transform. It can be a string with spaces or a 
 * snake case format
 * @returns the camel case transformed string
 */
export function camelCase( str: string ) {
	if ( !str ) return ''

	return str.replace(
		/([-_ ][\w])/g,
		group => group.toUpperCase().replace('-', '').replace('_', '').replace(' ', '')
	)
}

/**
 * Transforms a string in to a snake case format (snake-case-format)
 * @param str the string to transform. It can be a string with spaces or a camel
 * case format
 * @param snakeChar the character used to separate words. If the passed string is
 * in camel case and the snakeChar is a space, this will transform the came case
 * string in to a regular spaced string
 * @returns the snake case transformed string
 */
export function snakeCase( str: string, snakeChar: string = '-' ) {
	if ( !str ) return ''
	const replaced = str.slice(1).replace(/( |[A-Z])/g, g => g===' '? '-' : snakeChar + g[0].toLowerCase() )
	return str[0].toLocaleLowerCase() + replaced.replace(/--/g, '-')
}

/**
 * Gets the value of the supproperty in the passed object
 * 
 * @param obj the object containing the subproperty 
 * @param path a string containing the subproperty path in dotted notation
 * @returns the value of the supproperty in the passed object
 */
export function getDeepValue<T extends {}, P extends PropPath<T>>( obj: T, path: P ): PropPathType<T, P> {
	return path.split('.').reduce(( acc: {}, prop: string ) => acc[ prop ], obj )
}
