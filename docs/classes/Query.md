[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / Query

# Class: Query\<T\>

Defined in: [store/model.ts:232](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/model.ts#L232)

The Query class is used to define the search conditions. You can chain
where operations to define the search conditions. The where operations
are stored in a QueryObject that is passed to the query method of the
Model class.

## Type Parameters

### T

`T` *extends* [`Persistent`](Persistent.md)

## Constructors

### Constructor

> **new Query**\<`T`\>(`model`): `Query`\<`T`\>

Defined in: [store/model.ts:233](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/model.ts#L233)

#### Parameters

##### model

[`Model`](Model.md)\<`T`\>

#### Returns

`Query`\<`T`\>

## Methods

### and()

> **and**\<`P`\>(`property`, `operator`, `value`): `Query`\<`T`\>

Defined in: [store/model.ts:334](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/model.ts#L334)

Matches all documents that the value of the property satisfies the condition
in the operator parameter and aggregates the results to the previous query

#### Type Parameters

##### P

`P` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### property

`P`

the property to be compared

##### operator

[`QueryOperator`](../type-aliases/QueryOperator.md)

the operator to be used in the comparison. The available
operators are: ==, !=, >, >=, < and <=

##### value

[`Persistent`](Persistent.md) \| `Partial`\<`T`\[`P`\]\>

#### Returns

`Query`\<`T`\>

this Query object to make chained calls possible

#### Example

```ts
query.where( 'name', '==', 'John' ).and( 'age', '>', 18 )
```

#### See

 - andDeepProp
 - where
 - whereDeepProp
 - or
 - orDeepProp

***

### andDeepProp()

> **andDeepProp**(`propertyPath`, `operator`, `value`): `Query`\<`T`\>

Defined in: [store/model.ts:354](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/model.ts#L354)

Matches all documents that the value of the deep property satisfies the condition
in the operator parameter and aggregates the results to the previous query

#### Parameters

##### propertyPath

\{ \[P in string \| number \| symbol\]: T\[P\] extends Function ? never : T\[P\] extends any ? T\[P\] extends ArrayLike\<any\> \| Primitive ? \`$\{string & P\}\` : \`$\{string & P\}\` \| \{ \[P in string \| number \| symbol\]: ((...) & (...))\[P\] extends Function ? never : (...)\[(...)\] extends any ? (...) extends (...) ? (...) : (...) : never \}\[keyof T\[P\]\] : never \}\[keyof `T`\]

the path to the property to be compared

##### operator

[`QueryOperator`](../type-aliases/QueryOperator.md)

the operator to be used in the comparison. The available
operators are: ==, !=, >, >=, < and <=

##### value

\{ \[P in string \| number \| symbol\]: T\[P\] extends Function ? never : T\[P\] extends any ? T\[P\] extends ArrayLike\<any\> \| Primitive ? \`$\{string & P\}\` : \`$\{string & P\}\` \| \{ \[P in string \| number \| symbol\]: (...)\[(...)\] extends Function ? never : (...) extends (...) ? (...) : (...) \}\[keyof T\[P\]\] : never \}\[keyof `T`\] *extends* keyof `T` ? `T`\[`any`\[`any`\]\] : \{ \[P in string \| number \| symbol\]: T\[P\] extends Function ? never : T\[P\] extends any ? T\[P\] extends ArrayLike\<any\> \| Primitive ? \`$\{string & P\}\` : \`$\{string & P\}\` \| \{ \[P in (...) \| (...) \| (...)\]: (...) extends (...) ? (...) : (...) \}\[keyof (...)\[(...)\]\] : never \}\[keyof `T`\] *extends* `` `${PropName}.${SubPropName}` `` ? `PropName` *extends* keyof `T` ? `SubPropName` *extends* keyof `T`\[`PropName`\] ? `T`\[`PropName`\]\[`SubPropName`\] : `SubPropName` *extends* `` `${PropName}.${SubPropName}` `` ? `PropName` *extends* keyof `T`\[`PropName`\] ? `SubPropName` *extends* keyof `T`\[`PropName`\]\[`PropName`\] ? `T`\[`PropName`\]\[`PropName`\]\[`SubPropName`\] : `SubPropName` *extends* `` `${PropName}.${SubPropName}` `` ? `PropName` *extends* keyof ...\[...\] ? `never` : `never` : `never` : `never` : `never` : `never` : `never`

the value to be compared

#### Returns

`Query`\<`T`\>

this Query object to make chained calls possible

#### Example

```ts
query.whereDeepProp( 'address.street', '==', 'Main Street' ).andDeepProp( 'address.city', '==', 'New York' )
```

#### See

 - and
 - where
 - whereDeepProp
 - or
 - orDeepProp

***

### count()

> **count**(): `Promise`\<`number`\>

Defined in: [store/model.ts:482](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/model.ts#L482)

Returns the number of documents that match the query

#### Returns

`Promise`\<`number`\>

a promise resolving to the number of documents that match the query

#### Example

```ts
const count = await query.where( 'name', '==', 'John' ).count()
```

***

### get()

> **get**\<`U`\>(`limit?`): `Promise`\<`U`[]\>

Defined in: [store/model.ts:422](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/model.ts#L422)

Executes the query and returns the result

#### Type Parameters

##### U

`U` *extends* [`Persistent`](Persistent.md)

#### Parameters

##### limit?

`number`

the max amount of documents to retrieve. If not set, uses the
last limit set or all the matching documents

#### Returns

`Promise`\<`U`[]\>

a promise resolving to a collection of matched documents

#### Example

```ts
const namedJohn = await query.where( 'name', '==', 'John' ).get()
```

***

### getQueryModel()

> **getQueryModel**(): [`Model`](Model.md)\<`T`\>

Defined in: [store/model.ts:490](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/model.ts#L490)

#### Returns

[`Model`](Model.md)\<`T`\>

***

### getQueryObject()

> **getQueryObject**(): [`QueryObject`](../type-aliases/QueryObject.md)\<`T`\>

Defined in: [store/model.ts:486](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/model.ts#L486)

#### Returns

[`QueryObject`](../type-aliases/QueryObject.md)\<`T`\>

***

### instanceOf()

> **instanceOf**\<`U`\>(`classId`): `Query`\<`T`\>

Defined in: [store/model.ts:404](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/model.ts#L404)

Defines a where condition to match documents that are instances of the
given class

#### Type Parameters

##### U

`U` *extends* [`Persistent`](Persistent.md)

#### Parameters

##### classId

`string` \| `U`

the class name or an instance to match

#### Returns

`Query`\<`T`\>

this Query object to make chained calls possible

#### Example

```ts
query.instanceOf( 'Person' )
query.instanceOf( Person )
query.instanceOf( Person ).where( 'age', '>', 18 )
```

***

### limit()

> **limit**(`maxDocs`): `Query`\<`T`\>

Defined in: [store/model.ts:436](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/model.ts#L436)

Limits the number of documents to retrieve

#### Parameters

##### maxDocs

`number`

the max amount of documents to retrieve

#### Returns

`Query`\<`T`\>

this Query object to make chained calls possible

#### Example

```ts
query.where( 'name', '==', 'John' ).limit( 10 )
```

***

### or()

> **or**\<`P`\>(`property`, `operator`, `value`): `Query`\<`T`\>

Defined in: [store/model.ts:372](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/model.ts#L372)

Matches all documents that the value of the property satisfies the condition
in the operator parameter and aggregates the results to the previous query

#### Type Parameters

##### P

`P` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### property

`P`

the property to be compared

##### operator

[`QueryOperator`](../type-aliases/QueryOperator.md)

the operator to be used in the comparison. The available
operators are: ==, !=, >, >=, < and <=

##### value

[`Persistent`](Persistent.md) \| `Partial`\<`T`\[`P`\]\>

#### Returns

`Query`\<`T`\>

this Query object to make chained calls possible

#### Example

```ts
query.or( 'name', '==', 'John' )
query.or( 'age', '>', 18 )
```

#### See

 - orDeepProp
 - where
 - whereDeepProp

***

### orDeepProp()

> **orDeepProp**(`propertyPath`, `operator`, `value`): `Query`\<`T`\>

Defined in: [store/model.ts:390](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/model.ts#L390)

Matches all documents that the value of the deep property satisfies the condition
in the operator parameter and aggregates the results to the previous query

#### Parameters

##### propertyPath

\{ \[P in string \| number \| symbol\]: T\[P\] extends Function ? never : T\[P\] extends any ? T\[P\] extends ArrayLike\<any\> \| Primitive ? \`$\{string & P\}\` : \`$\{string & P\}\` \| \{ \[P in string \| number \| symbol\]: ((...) & (...))\[P\] extends Function ? never : (...)\[(...)\] extends any ? (...) extends (...) ? (...) : (...) : never \}\[keyof T\[P\]\] : never \}\[keyof `T`\]

the path to the property to be compared

##### operator

[`QueryOperator`](../type-aliases/QueryOperator.md)

the operator to be used in the comparison. The available
operators are: ==, !=, >, >=, < and <=

##### value

\{ \[P in string \| number \| symbol\]: T\[P\] extends Function ? never : T\[P\] extends any ? T\[P\] extends ArrayLike\<any\> \| Primitive ? \`$\{string & P\}\` : \`$\{string & P\}\` \| \{ \[P in string \| number \| symbol\]: (...)\[(...)\] extends Function ? never : (...) extends (...) ? (...) : (...) \}\[keyof T\[P\]\] : never \}\[keyof `T`\] *extends* keyof `T` ? `T`\[`any`\[`any`\]\] : \{ \[P in string \| number \| symbol\]: T\[P\] extends Function ? never : T\[P\] extends any ? T\[P\] extends ArrayLike\<any\> \| Primitive ? \`$\{string & P\}\` : \`$\{string & P\}\` \| \{ \[P in (...) \| (...) \| (...)\]: (...) extends (...) ? (...) : (...) \}\[keyof (...)\[(...)\]\] : never \}\[keyof `T`\] *extends* `` `${PropName}.${SubPropName}` `` ? `PropName` *extends* keyof `T` ? `SubPropName` *extends* keyof `T`\[`PropName`\] ? `T`\[`PropName`\]\[`SubPropName`\] : `SubPropName` *extends* `` `${PropName}.${SubPropName}` `` ? `PropName` *extends* keyof `T`\[`PropName`\] ? `SubPropName` *extends* keyof `T`\[`PropName`\]\[`PropName`\] ? `T`\[`PropName`\]\[`PropName`\]\[`SubPropName`\] : `SubPropName` *extends* `` `${PropName}.${SubPropName}` `` ? `PropName` *extends* keyof ...\[...\] ? `never` : `never` : `never` : `never` : `never` : `never` : `never`

the value to be compared

#### Returns

`Query`\<`T`\>

this Query object to make chained calls possible

#### Example

```ts
query.orDeepProp( 'address.street', '==', 'Main Street' )
```

#### See

 - or
 - where
 - whereDeepProp

***

### orderBy()

> **orderBy**\<`P`\>(`propertyName`, `order?`): `Query`\<`T`\>

Defined in: [store/model.ts:450](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/model.ts#L450)

Orders the result set by a property.

#### Type Parameters

##### P

`P` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### propertyName

`P`

The name of the property to order by

##### order?

[`QueryOrder`](../type-aliases/QueryOrder.md) = `'asc'`

The sort direction. Possible values are 'asc' and 'desc'

#### Returns

`Query`\<`T`\>

a chainable query object

#### Example

```ts
query.orderBy( 'name', 'asc' )
query.orderBy( 'age', 'desc' )
```

***

### orderByDeepProp()

> **orderByDeepProp**(`propertyPath`, `order?`): `Query`\<`T`\>

Defined in: [store/model.ts:467](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/model.ts#L467)

Orders the result set by a deep property

#### Parameters

##### propertyPath

`string`

The full path of the deep property. It should be 
											separated by dots like person.name.firstName.

##### order?

[`QueryOrder`](../type-aliases/QueryOrder.md) = `'asc'`

The sort direction. Possible values are 'asc' and 'desc'

#### Returns

`Query`\<`T`\>

a chainable query object

***

### where()

> **where**\<`P`\>(`property`, `operator`, `value`, `aggregate?`): `Query`\<`T`\>

Defined in: [store/model.ts:256](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/model.ts#L256)

Matches all documents that the value of the property satisfies the condition
in the operator parameter. Subsequent `where` calls will be operated to the
previous ones using the AND operator

#### Type Parameters

##### P

`P` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### property

`P`

the property to be compared

##### operator

[`QueryOperator`](../type-aliases/QueryOperator.md)

the operator to be used in the comparison. The available
operators are: ==, !=, >, >=, < and <=

##### value

[`Persistent`](Persistent.md) \| `Partial`\<`T`\[`P`\]\>

the value to be compared

##### aggregate?

`boolean`

if true, the query will use the logical or operator and 
aggregate the results to the previous query

#### Returns

`Query`\<`T`\>

this Query object to make chained calls possible

#### Example

```ts
query.where( 'name', '==', 'John' )
query.where( 'age', '>', 18 )
query.where( 'age', '==', 18 ).where( 'name', '==', 'John' )
```

#### See

 - whereDeepProp
 - or
 - orDeepProp

***

### whereDeepProp()

> **whereDeepProp**(`propertyPath`, `operator`, `value`, `aggregate?`): `Query`\<`T`\>

Defined in: [store/model.ts:297](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/model.ts#L297)

Matches all documents that the value of the deep property satisfies the condition
in the operator parameter

#### Parameters

##### propertyPath

\{ \[P in string \| number \| symbol\]: T\[P\] extends Function ? never : T\[P\] extends any ? T\[P\] extends ArrayLike\<any\> \| Primitive ? \`$\{string & P\}\` : \`$\{string & P\}\` \| \{ \[P in string \| number \| symbol\]: ((...) & (...))\[P\] extends Function ? never : (...)\[(...)\] extends any ? (...) extends (...) ? (...) : (...) : never \}\[keyof T\[P\]\] : never \}\[keyof `T`\]

the path to the property to be compared

##### operator

[`QueryOperator`](../type-aliases/QueryOperator.md)

the operator to be used in the comparison. The available
operators are: ==, !=, >, >=, < and <=

##### value

\{ \[P in string \| number \| symbol\]: T\[P\] extends Function ? never : T\[P\] extends any ? T\[P\] extends ArrayLike\<any\> \| Primitive ? \`$\{string & P\}\` : \`$\{string & P\}\` \| \{ \[P in string \| number \| symbol\]: (...)\[(...)\] extends Function ? never : (...) extends (...) ? (...) : (...) \}\[keyof T\[P\]\] : never \}\[keyof `T`\] *extends* keyof `T` ? `T`\[`any`\[`any`\]\] : \{ \[P in string \| number \| symbol\]: T\[P\] extends Function ? never : T\[P\] extends any ? T\[P\] extends ArrayLike\<any\> \| Primitive ? \`$\{string & P\}\` : \`$\{string & P\}\` \| \{ \[P in (...) \| (...) \| (...)\]: (...) extends (...) ? (...) : (...) \}\[keyof (...)\[(...)\]\] : never \}\[keyof `T`\] *extends* `` `${PropName}.${SubPropName}` `` ? `PropName` *extends* keyof `T` ? `SubPropName` *extends* keyof `T`\[`PropName`\] ? `T`\[`PropName`\]\[`SubPropName`\] : `SubPropName` *extends* `` `${PropName}.${SubPropName}` `` ? `PropName` *extends* keyof `T`\[`PropName`\] ? `SubPropName` *extends* keyof `T`\[`PropName`\]\[`PropName`\] ? `T`\[`PropName`\]\[`PropName`\]\[`SubPropName`\] : `SubPropName` *extends* `` `${PropName}.${SubPropName}` `` ? `PropName` *extends* keyof ...\[...\] ? `never` : `never` : `never` : `never` : `never` : `never` : `never`

the value to be compared

##### aggregate?

`boolean`

#### Returns

`Query`\<`T`\>

this Query object to make chained calls possible

#### Example

```ts
query.whereDeepProp( 'address.street', '==', 'Main Street' )
```

#### See

 - where
 - or
 - orDeepProp
