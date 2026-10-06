import type { DocumentObject } from './data-source'

/**
 * Resolves the page retrieved by a {@link QueryCursor}. It lets a data source
 * inject its own async behaviour (for example a simulated delay) without the
 * cursor depending on the data source implementation.
 */
export type QueryCursorResolver = ( docs: DocumentObject[] ) => Promise<DocumentObject[]>

const immediateResolver: QueryCursorResolver = ( docs ) => Promise.resolve( docs )

/**
 * A handle over one query's result stream. It carries the matching documents,
 * the page size and the current position, so pagination is local to the query
 * that produced it instead of being shared across the data source.
 */
export class QueryCursor {
	/**
	 * @param docs the full set of documents matching the query
	 * @param limit the page size. Zero means no limit: the first `next` returns
	 * every remaining document and later calls return an empty page
	 * @param resolve the function used to resolve each retrieved page
	 */
	constructor(
		docs: DocumentObject[],
		limit: number = 0,
		resolve: QueryCursorResolver = immediateResolver
	) {
		this._docs = docs
		this._limit = limit
		this._resolve = resolve
	}

	/**
	 * Retrieves the next page of documents and advances the cursor. Every call
	 * resolves through the injected resolver, so each page read incurs exactly
	 * one data source async step (one simulated delay per page in JsonDataSource).
	 * @param limit the max amount of documents to retrieve. When set it replaces
	 * the cursor's current page size
	 * @returns a promise resolving to the next page of documents
	 */
	next( limit?: number ): Promise<DocumentObject[]> {
		if ( limit !== undefined ) this._limit = limit

		const remaining = this._docs.length - this._position
		const pageSize = this._limit > 0 ? this._limit : remaining
		const page = this._docs.slice( this._position, this._position + pageSize )
		this._position += page.length

		return this._resolve( page )
	}

	private _docs: DocumentObject[]
	private _limit: number
	private _position: number = 0
	private _resolve: QueryCursorResolver
}
