[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / persistentReferenceWithCachedProps

# Function: persistentReferenceWithCachedProps()

> **persistentReferenceWithCachedProps**\<`T`\>(`cachedProps`, `propTypeName`, `storeInCollection?`, `targetCollection?`): (`target`, `property`) => `void`

Defined in: [persistent/persistent.ts:640](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L640)

Decorator to declare a persistent reference (see @persistentReference) that stores
the values in cachedProps as values in the reference object. This is useful
when you are not able to wait for population of referenced properties.

## Type Parameters

### T

`T` *extends* [`Persistent`](../classes/Persistent.md)

## Parameters

### cachedProps

[`ClassPropNamesOfType`](../type-aliases/ClassPropNamesOfType.md)\<`T`, [`Primitive`](../type-aliases/Primitive.md)\>[]

Pass an array of properties whose values should be stored in the reference object or an object
with the cachedProps configuration.

### propTypeName

`string` \| `string`[]

the accepted type name or type names of the property

### storeInCollection?

`string` \| [`CollectionPathCallback`](../type-aliases/CollectionPathCallback.md)

indicates the path of the collection where this reference is stored

### targetCollection?

`string` \| [`CollectionPathCallback`](../type-aliases/CollectionPathCallback.md)

indicates the path of the target collection. The storedCollection param refers to the collection
where this reference is stored whereas the targetCollection param refers to the collection where the object containing the 
property is stored.

## Returns

(`target`, `property`) => `void`

## See

 - persistentReference
 - CachedPropsConfig
 - persistentPureReferenceWithCachedProps

## Example

```ts
class UserGroup extends Persistent {
	@persistentReferenceWithCachedProps( ['name', 'email'], 'Customer/Clients', 'User' ) private _friend: User
}

class SpecialUserGroup extends Persistent {
	@persistentReferenceWithCachedProps( { cachedProps: ['name', 'email'], updater: async ( event, prop ) => {
		// do something when the referenced user is updated
	}}, undefined, [ 'SpecialUser', 'User' ] ) private _friend: User
}
```
