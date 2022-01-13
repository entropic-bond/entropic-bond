export interface Values {
	[ varName: string ]: string;
}

export function replaceValue( text: string, values: Values ): string {
	if ( !text ) return ''
	
	return text.replace(/\${\s*(\w*)\s*}/g, function( _match , group){
		return values[ group ] || '';
	});
}

export function camelCase( str: string ) {
	if ( !str ) return ''

	return str.replace(
		/([-_][\w])/g,
		group => group.toUpperCase().replace('-', '').replace('_', '')
	)
}

export function snakeCase( str: string, snakeChar: string = '-' ) {
	if ( !str ) return ''
	return str[0].toLocaleLowerCase() + str.slice(1).replace(/([A-Z])/g, g => snakeChar + g[0].toLowerCase() );
}
