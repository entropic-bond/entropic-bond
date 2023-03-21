[entropic-bond](README.md) / Exports

# entropic-bond

## Table of contents

### Enumerations

- [StoredFileEvent](enums/StoredFileEvent.md)

### Classes

- [Auth](classes/Auth.md)
- [AuthMock](classes/AuthMock.md)
- [AuthService](classes/AuthService.md)
- [CloudFunctions](classes/CloudFunctions.md)
- [CloudFunctionsMock](classes/CloudFunctionsMock.md)
- [CloudStorage](classes/CloudStorage.md)
- [DataSource](classes/DataSource.md)
- [EntropicComponent](classes/EntropicComponent.md)
- [JsonDataSource](classes/JsonDataSource.md)
- [MockCloudStorage](classes/MockCloudStorage.md)
- [Model](classes/Model.md)
- [Observable](classes/Observable.md)
- [Persistent](classes/Persistent.md)
- [ServerAuth](classes/ServerAuth.md)
- [ServerAuthMock](classes/ServerAuthMock.md)
- [ServerAuthService](classes/ServerAuthService.md)
- [Store](classes/Store.md)
- [StoredFile](classes/StoredFile.md)

### Interfaces

- [AuthError](interfaces/AuthError.md)
- [CloudFunctionsService](interfaces/CloudFunctionsService.md)
- [Collection](interfaces/Collection.md)
- [CustomCredentials](interfaces/CustomCredentials.md)
- [DocumentReference](interfaces/DocumentReference.md)
- [JsonRawData](interfaces/JsonRawData.md)
- [SignData](interfaces/SignData.md)
- [StoreParams](interfaces/StoreParams.md)
- [StoredFileChange](interfaces/StoredFileChange.md)
- [UploadControl](interfaces/UploadControl.md)
- [UserCredentials](interfaces/UserCredentials.md)
- [Values](interfaces/Values.md)

### Type Aliases

- [AuthErrorCode](modules.md#autherrorcode)
- [AuthProvider](modules.md#authprovider)
- [Callback](modules.md#callback)
- [ClassArrayPropNames](modules.md#classarraypropnames)
- [ClassArrayProps](modules.md#classarrayprops)
- [ClassMethodNames](modules.md#classmethodnames)
- [ClassMethods](modules.md#classmethods)
- [ClassPropNames](modules.md#classpropnames)
- [ClassPropNamesOfType](modules.md#classpropnamesoftype)
- [ClassProps](modules.md#classprops)
- [CloudFunction](modules.md#cloudfunction)
- [Collections](modules.md#collections)
- [CompareFunction](modules.md#comparefunction)
- [DocumentObject](modules.md#documentobject)
- [Elements](modules.md#elements)
- [MakePersistentObjects](modules.md#makepersistentobjects)
- [PersistentConstructor](modules.md#persistentconstructor)
- [PersistentObject](modules.md#persistentobject)
- [PropChangeCallback](modules.md#propchangecallback)
- [PropChangeEvent](modules.md#propchangeevent)
- [PropPath](modules.md#proppath)
- [PropPathType](modules.md#proppathtype)
- [QueryObject](modules.md#queryobject)
- [QueryOperation](modules.md#queryoperation)
- [QueryOperator](modules.md#queryoperator)
- [QueryOrder](modules.md#queryorder)
- [RejectedCallback](modules.md#rejectedcallback)
- [ResovedCallback](modules.md#resovedcallback)
- [SomeClassPropNames](modules.md#someclasspropnames)
- [SomeClassProps](modules.md#someclassprops)
- [StorableData](modules.md#storabledata)
- [Unsubscriber](modules.md#unsubscriber)
- [UploadProgress](modules.md#uploadprogress)

### Functions

- [camelCase](modules.md#camelcase)
- [getDeepValue](modules.md#getdeepvalue)
- [persistent](modules.md#persistent)
- [persistentParser](modules.md#persistentparser)
- [persistentPureReference](modules.md#persistentpurereference)
- [persistentPureReferenceWithPersistentProps](modules.md#persistentpurereferencewithpersistentprops)
- [persistentReference](modules.md#persistentreference)
- [persistentReferenceAt](modules.md#persistentreferenceat)
- [persistentReferenceWithPersistentProps](modules.md#persistentreferencewithpersistentprops)
- [registerCloudStorage](modules.md#registercloudstorage)
- [registerLegacyClassName](modules.md#registerlegacyclassname)
- [registerPersistentClass](modules.md#registerpersistentclass)
- [replaceValue](modules.md#replacevalue)
- [snakeCase](modules.md#snakecase)

## Type Aliases

### AuthErrorCode

Ƭ **AuthErrorCode**: ``"wrongPassword"`` \| ``"popupClosedByUser"`` \| ``"userNotFound"`` \| ``"invalidEmail"`` \| ``"missingPassword"`` \| ``"missingEmail"``

#### Defined in

[auth/auth.ts:18](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/auth/auth.ts#L18)

___

### AuthProvider

Ƭ **AuthProvider**: ``"email"`` \| ``"facebook"`` \| ``"google"`` \| ``"twitter"``

#### Defined in

[auth/user-auth-types.ts:13](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/auth/user-auth-types.ts#L13)

___

### Callback

Ƭ **Callback**<`T`\>: (`event`: `T`) => `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`event`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `T` |

##### Returns

`void`

#### Defined in

[observable/observable.ts:1](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/observable/observable.ts#L1)

___

### ClassArrayPropNames

Ƭ **ClassArrayPropNames**<`T`\>: { [K in keyof T]: T[K] extends unknown[] \| Readonly<unknown[]\> ? K : never }[keyof `T`]

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[types/utility-types.ts:17](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/types/utility-types.ts#L17)

___

### ClassArrayProps

Ƭ **ClassArrayProps**<`T`\>: `Pick`<`T`, [`ClassArrayPropNames`](modules.md#classarraypropnames)<`T`\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[types/utility-types.ts:21](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/types/utility-types.ts#L21)

___

### ClassMethodNames

Ƭ **ClassMethodNames**<`T`\>: { [K in keyof T]: T[K] extends Function ? K : never }[keyof `T`]

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[types/utility-types.ts:1](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/types/utility-types.ts#L1)

___

### ClassMethods

Ƭ **ClassMethods**<`T`\>: `Pick`<`T`, [`ClassMethodNames`](modules.md#classmethodnames)<`T`\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[types/utility-types.ts:5](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/types/utility-types.ts#L5)

___

### ClassPropNames

Ƭ **ClassPropNames**<`T`\>: { [K in keyof T]: T[K] extends Function ? never : K }[keyof `T`]

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[types/utility-types.ts:7](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/types/utility-types.ts#L7)

___

### ClassPropNamesOfType

Ƭ **ClassPropNamesOfType**<`T`, `U`\>: { [K in keyof T]: T[K] extends Function ? never : T[K] extends U ? K : never }[keyof `T`]

#### Type parameters

| Name |
| :------ |
| `T` |
| `U` |

#### Defined in

[types/utility-types.ts:68](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/types/utility-types.ts#L68)

___

### ClassProps

Ƭ **ClassProps**<`T`\>: `Pick`<`T`, [`ClassPropNames`](modules.md#classpropnames)<`T`\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[types/utility-types.ts:11](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/types/utility-types.ts#L11)

___

### CloudFunction

Ƭ **CloudFunction**<`P`, `R`\>: (`param?`: `P`) => `Promise`<`R`\>

#### Type parameters

| Name |
| :------ |
| `P` |
| `R` |

#### Type declaration

▸ (`param?`): `Promise`<`R`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `param?` | `P` |

##### Returns

`Promise`<`R`\>

#### Defined in

[cloud-functions/cloud-functions.ts:4](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/cloud-functions/cloud-functions.ts#L4)

___

### Collections

Ƭ **Collections**: `Object`

A collection of document objects typically returned by Persistent.toObject()

**`See`**

Persistent.toObject

#### Index signature

▪ [collectionPath: `string`]: [`PersistentObject`](modules.md#persistentobject)<[`Persistent`](classes/Persistent.md)\>[]

#### Defined in

[persistent/persistent.ts:36](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/persistent/persistent.ts#L36)

___

### CompareFunction

Ƭ **CompareFunction**<`T`\>: (`a`: `ArrayPropsElem`<`T`\>, `b`: `ArrayPropsElem`<`T`\>) => `boolean`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`a`, `b`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `ArrayPropsElem`<`T`\> |
| `b` | `ArrayPropsElem`<`T`\> |

##### Returns

`boolean`

#### Defined in

[persistent/entropic-component.ts:8](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/persistent/entropic-component.ts#L8)

___

### DocumentObject

Ƭ **DocumentObject**: [`PersistentObject`](modules.md#persistentobject)<[`Persistent`](classes/Persistent.md)\>

#### Defined in

[store/data-source.ts:4](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/store/data-source.ts#L4)

___

### Elements

Ƭ **Elements**<`T`\>: `T` extends `ReadonlyArray`<`any`\> ? `T`[`number`] : `T` extends `ArrayLike`<`any`\> ? `T`[`number`] : `T` extends `object` ? `T`[keyof `T`] : `never`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `ReadonlyArray`<`any`\> \| `ArrayLike`<`any`\> \| `Record`<`any`, `any`\> |

#### Defined in

[types/utility-types.ts:23](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/types/utility-types.ts#L23)

___

### MakePersistentObjects

Ƭ **MakePersistentObjects**<`T`\>: { [A in keyof T]: T[A] extends Persistent ? PersistentObject<T[A]\> : MakePersistentObjects<T[A]\> }

The type of the plain object of a persistent class for all the nested properties.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[persistent/persistent.ts:28](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/persistent/persistent.ts#L28)

___

### PersistentConstructor

Ƭ **PersistentConstructor**: () => [`Persistent`](classes/Persistent.md)

#### Type declaration

• ()

#### Defined in

[persistent/persistent.ts:4](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/persistent/persistent.ts#L4)

___

### PersistentObject

Ƭ **PersistentObject**<`T`\>: `Omit`<[`SomeClassProps`](modules.md#someclassprops)<`T`\>, ``"className"``\> & { `__className?`: `string` ; `__documentReference?`: { `storedInCollection`: `string`  } ; `__rootCollections?`: [`Collections`](modules.md#collections)  }

The corresponding type of the plain object of a persistent class.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Persistent`](classes/Persistent.md) |

#### Defined in

[persistent/persistent.ts:16](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/persistent/persistent.ts#L16)

___

### PropChangeCallback

Ƭ **PropChangeCallback**<`T`\>: [`Callback`](modules.md#callback)<[`PropChangeEvent`](modules.md#propchangeevent)<`T`\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[persistent/entropic-component.ts:6](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/persistent/entropic-component.ts#L6)

___

### PropChangeEvent

Ƭ **PropChangeEvent**<`T`\>: `Partial`<[`ClassProps`](modules.md#classprops)<`T`\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[persistent/entropic-component.ts:5](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/persistent/entropic-component.ts#L5)

___

### PropPath

Ƭ **PropPath**<`T`, `AllowedTypes`, `MaxDepth`, `Prefix`\>: `MaxDepth` extends `number` ? { [P in keyof T]: T[P] extends Function ? never : T[P] extends AllowedTypes ? T[P] extends Primitive \| ArrayLike<any\> ? Concat<Prefix, P\> : Concat<Prefix, P\> \| PropPath<T[P], AllowedTypes, Decr[MaxDepth], \`${Concat<Prefix, P\>}.\`\> : never }[keyof `T`] & `string` : `never`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |
| `AllowedTypes` | `any` |
| `MaxDepth` | extends `number` = ``3`` |
| `Prefix` | ``""`` |

#### Defined in

[types/utility-types.ts:93](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/types/utility-types.ts#L93)

___

### PropPathType

Ƭ **PropPathType**<`T`, `Path`, `MaxDepth`\>: `MaxDepth` extends `number` ? `Path` extends keyof `T` ? `T`[`Path`] : `Path` extends \`${infer PropName}.${infer SubPropName}\` ? `PropName` extends keyof `T` ? [`PropPathType`](modules.md#proppathtype)<`T`[`PropName`], `SubPropName`, `Decr`[`MaxDepth`]\> : `never` : `never` : `never`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `Path` | `Path` |
| `MaxDepth` | extends `number` = ``2`` |

#### Defined in

[types/utility-types.ts:99](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/types/utility-types.ts#L99)

___

### QueryObject

Ƭ **QueryObject**<`T`\>: `Object`

A representation of a full query

**`Param`**

the query operations to be performed

**`Param`**

the maximum number of items to be retrieved

**`Param`**

sort info

**`Param`**

the sort order

**`Param`**

the name of the property to be used for sorting

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `limit?` | `number` |
| `operations?` | [`QueryOperation`](modules.md#queryoperation)<`T`\>[] |
| `sort?` | { `order`: [`QueryOrder`](modules.md#queryorder) ; `propertyName`: [`ClassPropNames`](modules.md#classpropnames)<`T`\> \| `string`  } |
| `sort.order` | [`QueryOrder`](modules.md#queryorder) |
| `sort.propertyName` | [`ClassPropNames`](modules.md#classpropnames)<`T`\> \| `string` |

#### Defined in

[store/data-source.ts:44](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/store/data-source.ts#L44)

___

### QueryOperation

Ƭ **QueryOperation**<`T`\>: `Object`

A representation of a query operation

**`Param`**

the name of the property to be used in the query

**`Param`**

the operator to be used in the query

**`Param`**

the value to be used in the query

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `operator` | [`QueryOperator`](modules.md#queryoperator) |
| `property` | [`ClassPropNames`](modules.md#classpropnames)<`T`\> |
| `value` | `Partial`<`T`[[`ClassPropNames`](modules.md#classpropnames)<`T`\>]\> \| { `[key: string]`: `unknown`;  } |

#### Defined in

[store/data-source.ts:23](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/store/data-source.ts#L23)

___

### QueryOperator

Ƭ **QueryOperator**: ``"=="`` \| ``"!="`` \| ``"<"`` \| ``"<="`` \| ``">"`` \| ``">="``

The query operators

**`Param`**

equal

**`Param`**

not equal

**`Param`**

less than

**`Param`**

less than or equal

**`Param`**

greater than

**`Param`**

greater than or equal

#### Defined in

[store/data-source.ts:15](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/store/data-source.ts#L15)

___

### QueryOrder

Ƭ **QueryOrder**: ``"asc"`` \| ``"desc"``

The sort order

**`Param`**

ascending order

**`Param`**

descending order

#### Defined in

[store/data-source.ts:34](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/store/data-source.ts#L34)

___

### RejectedCallback

Ƭ **RejectedCallback**: (`reason`: [`AuthError`](interfaces/AuthError.md)) => `void`

#### Type declaration

▸ (`reason`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `reason` | [`AuthError`](interfaces/AuthError.md) |

##### Returns

`void`

#### Defined in

[auth/auth.ts:29](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/auth/auth.ts#L29)

___

### ResovedCallback

Ƭ **ResovedCallback**<`T`\>: (`credentials`: [`UserCredentials`](interfaces/UserCredentials.md)<`T`\>) => `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

#### Type declaration

▸ (`credentials`): `void`

Types the callback to accept a user credentials object

##### Parameters

| Name | Type |
| :------ | :------ |
| `credentials` | [`UserCredentials`](interfaces/UserCredentials.md)<`T`\> |

##### Returns

`void`

#### Defined in

[auth/auth.ts:28](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/auth/auth.ts#L28)

___

### SomeClassPropNames

Ƭ **SomeClassPropNames**<`T`\>: `Partial`<[`ClassPropNames`](modules.md#classpropnames)<`T`\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[types/utility-types.ts:15](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/types/utility-types.ts#L15)

___

### SomeClassProps

Ƭ **SomeClassProps**<`T`\>: `Partial`<[`ClassProps`](modules.md#classprops)<`T`\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[types/utility-types.ts:13](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/types/utility-types.ts#L13)

___

### StorableData

Ƭ **StorableData**: `File` \| `Blob` \| `Uint8Array` \| `ArrayBuffer`

#### Defined in

[cloud-storage/cloud-storage.ts:16](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/cloud-storage/cloud-storage.ts#L16)

___

### Unsubscriber

Ƭ **Unsubscriber**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[observable/observable.ts:2](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/observable/observable.ts#L2)

___

### UploadProgress

Ƭ **UploadProgress**: (`uploadedBytes`: `number`, `fileSize`: `number`) => `void`

#### Type declaration

▸ (`uploadedBytes`, `fileSize`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `uploadedBytes` | `number` |
| `fileSize` | `number` |

##### Returns

`void`

#### Defined in

[cloud-storage/cloud-storage.ts:1](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/cloud-storage/cloud-storage.ts#L1)

## Functions

### camelCase

▸ **camelCase**(`str`): `string`

Transforms a string to a camel case format (camelCaseFormat)

**`Example`**

```ts
const str = 'snake-case-format'
const result = camelCase( str )
// result = 'snakeCaseFormat'
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `str` | `string` | the string to transform. It can be a string with spaces or a snake case format |

#### Returns

`string`

the camel case transformed string

#### Defined in

[utils/utils.ts:42](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/utils/utils.ts#L42)

___

### getDeepValue

▸ **getDeepValue**<`T`, `P`\>(`obj`, `path`): [`PropPathType`](modules.md#proppathtype)<`T`, `P`\>

Gets the value of the supproperty in the passed object

**`Example`**

```ts
const obj = { a: { b: { c: 1 } } }
const path = 'a.b.c'
const result = getDeepValue( obj, path )
// result = 1
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |
| `P` | extends `string` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `obj` | `T` | the object containing the subproperty |
| `path` | `P` | a string containing the subproperty path in dotted notation |

#### Returns

[`PropPathType`](modules.md#proppathtype)<`T`, `P`\>

the value of the supproperty in the passed object

#### Defined in

[utils/utils.ts:82](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/utils/utils.ts#L82)

___

### persistent

▸ **persistent**(`target`, `property`): `void`

Decorator for a property that you want to persist.

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | [`Persistent`](classes/Persistent.md) |
| `property` | `string` |

#### Returns

`void`

#### Defined in

[persistent/persistent.ts:424](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/persistent/persistent.ts#L424)

___

### persistentParser

▸ **persistentParser**(`options?`): (`target`: [`Persistent`](classes/Persistent.md), `property`: `string`) => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `Partial`<`PersistentProperty`\> |

#### Returns

`fn`

▸ (`target`, `property`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `target` | [`Persistent`](classes/Persistent.md) |
| `property` | `string` |

##### Returns

`void`

#### Defined in

[persistent/persistent.ts:503](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/persistent/persistent.ts#L503)

___

### persistentPureReference

▸ **persistentPureReference**(`target`, `property`, `storeInCollection?`): `void`

Decorator for a property that is a reference to a persistent object. 
In this case, and contrary to the

**`Persistent Reference`**

decorator, the reference 
contents is not stored even it has been changed. Only the reference information 
is stored.

**`See`**

persistentReference

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | [`Persistent`](classes/Persistent.md) |
| `property` | `string` |
| `storeInCollection?` | `string` \| `CollectionPathCallback` |

#### Returns

`void`

#### Defined in

[persistent/persistent.ts:478](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/persistent/persistent.ts#L478)

___

### persistentPureReferenceWithPersistentProps

▸ **persistentPureReferenceWithPersistentProps**<`T`\>(`forcedPersistentProps`, `storeInCollection?`): (`target`: [`Persistent`](classes/Persistent.md), `property`: `string`) => `void`

Decorator to declare a persistent property as a pure reference (see @persistentPureReference) that stores
the values of the properties listed in forcedPersistentProps as values in the reference object. This is useful
when you only need a few properties to be available without needing to populate the referenced property.

**`See`**

 - persistentReferenceWithPersistentProps
 - persistentPureReference

**`Sample`**

class User extends Persistent {
	@persistentPureReferenceWithPersistentProps( ['name', 'email'] ) private _friend: User
}
// the reference object will contain the properties name and email of the referenced user
// without having to populate the _friend property

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Persistent`](classes/Persistent.md)<`T`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `forcedPersistentProps` | [`ClassPropNames`](modules.md#classpropnames)<`T`\>[] | the properties whose values should be stored in the reference object |
| `storeInCollection?` | `string` \| `CollectionPathCallback` | - |

#### Returns

`fn`

▸ (`target`, `property`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `target` | [`Persistent`](classes/Persistent.md) |
| `property` | `string` |

##### Returns

`void`

#### Defined in

[persistent/persistent.ts:497](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/persistent/persistent.ts#L497)

___

### persistentReference

▸ **persistentReference**(`target`, `property`): `void`

Decorator for a property that is a reference to a persistent object. 
The reference content is automatically stored in a collection. The collection 
is determined by the class name of the decorated property.

**`See`**

persistentPureReference

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | [`Persistent`](classes/Persistent.md) |
| `property` | `string` |

#### Returns

`void`

#### Defined in

[persistent/persistent.ts:449](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/persistent/persistent.ts#L449)

___

### persistentReferenceAt

▸ **persistentReferenceAt**(`collectionPath`): (`target`: [`Persistent`](classes/Persistent.md), `property`: `string`) => `void`

Decorator for a property that is a reference to a persistent object and should be stored
in a specific collection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionPath` | `string` \| `CollectionPathCallback` | the path to the collection where the reference should be stored. |

#### Returns

`fn`

▸ (`target`, `property`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `target` | [`Persistent`](classes/Persistent.md) |
| `property` | `string` |

##### Returns

`void`

#### Defined in

[persistent/persistent.ts:434](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/persistent/persistent.ts#L434)

___

### persistentReferenceWithPersistentProps

▸ **persistentReferenceWithPersistentProps**<`T`\>(`forcedPersistentProps`, `storeInCollection?`): (`target`: [`Persistent`](classes/Persistent.md), `property`: `string`) => `void`

Decorator to declare a persistent reference (see @persistentReference) that stores
the values in forcedPersistentProps as values in the reference object. This is useful
when you are not able to wait for population of referenced properties.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Persistent`](classes/Persistent.md)<`T`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `forcedPersistentProps` | [`ClassPropNames`](modules.md#classpropnames)<`T`\>[] | the properties whose values should be stored in the reference object |
| `storeInCollection?` | `string` \| `CollectionPathCallback` | - |

#### Returns

`fn`

▸ (`target`, `property`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `target` | [`Persistent`](classes/Persistent.md) |
| `property` | `string` |

##### Returns

`void`

#### Defined in

[persistent/persistent.ts:460](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/persistent/persistent.ts#L460)

___

### registerCloudStorage

▸ **registerCloudStorage**(`cloudStorageProviderName`, `factory`): (`constructor`: `Function`) => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cloudStorageProviderName` | `string` |
| `factory` | `CloudStorageFactory` |

#### Returns

`fn`

▸ (`constructor`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `constructor` | `Function` |

##### Returns

`void`

#### Defined in

[cloud-storage/cloud-storage.ts:54](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/cloud-storage/cloud-storage.ts#L54)

___

### registerLegacyClassName

▸ **registerLegacyClassName**(`legacyName`): (`constructor`: [`PersistentConstructor`](modules.md#persistentconstructor)) => `void`

Decorator to register a legacy name for a persistent class. This is useful when you want to
be able to load old data that was stored with a different class name.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `legacyName` | `string` | the legacy name of the class |

#### Returns

`fn`

▸ (`constructor`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `constructor` | [`PersistentConstructor`](modules.md#persistentconstructor) |

##### Returns

`void`

#### Defined in

[persistent/persistent.ts:540](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/persistent/persistent.ts#L540)

___

### registerPersistentClass

▸ **registerPersistentClass**(`className`, `annotation?`): (`constructor`: [`PersistentConstructor`](modules.md#persistentconstructor)) => `void`

Decorator to register a persistent class. Entropic Bond needs that you register
all persistent classes that you want to use in any persistent stream.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `className` | `string` | the name of the class |
| `annotation?` | `unknown` | an optional annotation that can be used to store additional information |

#### Returns

`fn`

▸ (`constructor`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `constructor` | [`PersistentConstructor`](modules.md#persistentconstructor) |

##### Returns

`void`

#### Defined in

[persistent/persistent.ts:528](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/persistent/persistent.ts#L528)

___

### replaceValue

▸ **replaceValue**(`text`, `values`): `string`

Replaces keys found in a string for its values. The keys should be inserted 
inside brackets ${ key } as is done in the string template literals substitutions

**`Example`**

```ts
const text = 'Hello ${name}, how are you ${ action }?'
const values = { name: 'John', action: 'today' }
const result = replaceValue( text, values )
// result = 'Hello John, how are you today?'
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `text` | `string` | the string template |
| `values` | [`Values`](interfaces/Values.md) | an object with key-value pairs |

#### Returns

`string`

the string filled with corresponding values

#### Defined in

[utils/utils.ts:24](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/utils/utils.ts#L24)

___

### snakeCase

▸ **snakeCase**(`str`, `snakeChar?`): `string`

Transforms a string in to a snake case format (snake-case-format)

**`Example`**

```ts
const str = 'camelCaseFormat'
const result = snakeCase( str )
// result = 'camel-case-format'
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `str` | `string` | `undefined` | the string to transform. It can be a string with spaces or a camel case format |
| `snakeChar` | `string` | `'-'` | the character used to separate words. If the passed string is in camel case and the snakeChar is a space, this will transform the came case string in to a regular spaced string |

#### Returns

`string`

the snake case transformed string

#### Defined in

[utils/utils.ts:64](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/utils/utils.ts#L64)
