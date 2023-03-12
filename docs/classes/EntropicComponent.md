[entropic-bond](../README.md) / [Exports](../modules.md) / EntropicComponent

# Class: EntropicComponent

Derived classes from EntropicComponent will have the ability to notify 
property changes by calling one of the provided notification methods.
It extends Persistent class therefore EntropicComponent children will have
persistance through the Entropic Bond persistence mechanism

## Hierarchy

- [`Persistent`](Persistent.md)

  ↳ **`EntropicComponent`**

## Table of contents

### Constructors

- [constructor](EntropicComponent.md#constructor)

### Properties

- [\_onChange](EntropicComponent.md#_onchange)

### Accessors

- [className](EntropicComponent.md#classname)
- [id](EntropicComponent.md#id)

### Methods

- [beforeSerialize](EntropicComponent.md#beforeserialize)
- [changeProp](EntropicComponent.md#changeprop)
- [clone](EntropicComponent.md#clone)
- [fromObject](EntropicComponent.md#fromobject)
- [getPersistentProperties](EntropicComponent.md#getpersistentproperties)
- [notify](EntropicComponent.md#notify)
- [onChange](EntropicComponent.md#onchange)
- [onSerialized](EntropicComponent.md#onserialized)
- [pushAndNotify](EntropicComponent.md#pushandnotify)
- [removeAndNotify](EntropicComponent.md#removeandnotify)
- [removeOnChange](EntropicComponent.md#removeonchange)
- [setId](EntropicComponent.md#setid)
- [toObject](EntropicComponent.md#toobject)
- [annotations](EntropicComponent.md#annotations)
- [classFactory](EntropicComponent.md#classfactory)
- [classesExtending](EntropicComponent.md#classesextending)
- [createInstance](EntropicComponent.md#createinstance)
- [registerFactory](EntropicComponent.md#registerfactory)
- [registeredClasses](EntropicComponent.md#registeredclasses)

## Constructors

### constructor

• **new EntropicComponent**(`id?`)

Returns a new instance of Persistent class.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Inherited from

[Persistent](Persistent.md).[constructor](Persistent.md#constructor)

#### Defined in

[persistent/persistent.ts:124](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/persistent/persistent.ts#L124)

## Properties

### \_onChange

• `Private` **\_onChange**: [`Observable`](Observable.md)<`Partial`<[`ClassProps`](../modules.md#classprops)<[`EntropicComponent`](EntropicComponent.md)\>\>\>

#### Defined in

[persistent/entropic-component.ts:134](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/persistent/entropic-component.ts#L134)

## Accessors

### className

• `get` **className**(): `string`

Gets the class name of this instance.

#### Returns

`string`

#### Inherited from

Persistent.className

#### Defined in

[persistent/persistent.ts:131](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/persistent/persistent.ts#L131)

___

### id

• `get` **id**(): `string`

Returns the id of this instance.

#### Returns

`string`

the id of this instance

#### Inherited from

Persistent.id

#### Defined in

[persistent/persistent.ts:147](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/persistent/persistent.ts#L147)

## Methods

### beforeSerialize

▸ `Protected` **beforeSerialize**(): `void`

This method is called by the persistence engine before the instance is
serialized.

#### Returns

`void`

#### Inherited from

[Persistent](Persistent.md).[beforeSerialize](Persistent.md#beforeserialize)

#### Defined in

[persistent/persistent.ts:161](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/persistent/persistent.ts#L161)

___

### changeProp

▸ `Protected` **changeProp**<`P`\>(`propName`, `value`): `boolean`

Changes the value of the property and notifies the subscribers about the change.
This is a helper method that can be used in the property setter.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `P` | extends keyof [`EntropicComponent`](EntropicComponent.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `propName` | `P` | the name of the property to be changed |
| `value` | [`EntropicComponent`](EntropicComponent.md)[`P`] | the new value for the property |

#### Returns

`boolean`

true in case the property has been effectively changed, false otherwise

#### Defined in

[persistent/entropic-component.ts:46](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/persistent/entropic-component.ts#L46)

___

### clone

▸ **clone**(`instance`): `void`

Copy the persistent properties of the given instance to this instance. 
The property `id` will be ignored.
Only the properties that are not null or undefined will be copied.

**`See`**

 - fromObject
 - toObject

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `instance` | [`Persistent`](Persistent.md) | the instance to be copied |

#### Returns

`void`

this instance

#### Inherited from

[Persistent](Persistent.md).[clone](Persistent.md#clone)

#### Defined in

[persistent/persistent.ts:183](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/persistent/persistent.ts#L183)

___

### fromObject

▸ **fromObject**(`obj`): [`EntropicComponent`](EntropicComponent.md)

Initializes the persistent properties of this instance from the properties 
of given object.

**`See`**

 - clone
 - toObject

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `obj` | [`PersistentObject`](../modules.md#persistentobject)<[`EntropicComponent`](EntropicComponent.md)\> | the object to be copied |

#### Returns

[`EntropicComponent`](EntropicComponent.md)

this instance

#### Inherited from

[Persistent](Persistent.md).[fromObject](Persistent.md#fromobject)

#### Defined in

[persistent/persistent.ts:197](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/persistent/persistent.ts#L197)

___

### getPersistentProperties

▸ **getPersistentProperties**(): readonly `PersistentProperty`[]

Returns an array of the persistent properties of this instance.

#### Returns

readonly `PersistentProperty`[]

an array of the persistent properties of this instance

#### Inherited from

[Persistent](Persistent.md).[getPersistentProperties](Persistent.md#getpersistentproperties)

#### Defined in

[persistent/persistent.ts:167](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/persistent/persistent.ts#L167)

___

### notify

▸ `Protected` **notify**<`T`\>(`event`): `void`

Notifies the subscribers a property or group of properties change.
This is a helper function to be used when you want to notify property changes.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`EntropicComponent`](EntropicComponent.md)<`T`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `Partial`<[`ClassProps`](../modules.md#classprops)<`T`\>\> | the event with the changed properties |

#### Returns

`void`

#### Defined in

[persistent/entropic-component.ts:64](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/persistent/entropic-component.ts#L64)

___

### onChange

▸ **onChange**(`listenerCallback`): [`Unsubscriber`](../modules.md#unsubscriber)

Subscribes a listener callback function. Every time a property is changed, 
the listener callback will be called with the property change event.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `listenerCallback` | [`PropChangeCallback`](../modules.md#propchangecallback)<[`EntropicComponent`](EntropicComponent.md)\> | the listener callback |

#### Returns

[`Unsubscriber`](../modules.md#unsubscriber)

a function to unsubscribe the listener from further notifications

#### Defined in

[persistent/entropic-component.ts:25](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/persistent/entropic-component.ts#L25)

___

### onSerialized

▸ `Protected` **onSerialized**(): `void`

This method is called by the persistence engine when the instance has been
just serialized. It is called after the properties are initialized.

#### Returns

`void`

#### Inherited from

[Persistent](Persistent.md).[onSerialized](Persistent.md#onserialized)

#### Defined in

[persistent/persistent.ts:155](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/persistent/persistent.ts#L155)

___

### pushAndNotify

▸ `Protected` **pushAndNotify**<`T`\>(`arrayPropName`, `element`, `isUnique?`): [`Elements`](../modules.md#elements)<`T`[[`ClassArrayPropNames`](../modules.md#classarraypropnames)<`T`\>]\>

Inserts a new element in an arbitrary array property of this class and 
fires a change event if successfully inserted. To avoid repeated elements
to be inserted, you can pass a function that checks for inequity.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`EntropicComponent`](EntropicComponent.md)<`T`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `arrayPropName` | [`ClassArrayPropNames`](../modules.md#classarraypropnames)<`T`\> | the name of the array property of this class where you want to insert the new element. |
| `element` | [`Elements`](../modules.md#elements)<`T`[[`ClassArrayPropNames`](../modules.md#classarraypropnames)<`T`\>]\> | the element to be inserted |
| `isUnique?` | [`CompareFunction`](../modules.md#comparefunction)<`T`\> | a function that checks for inequity of the two elements passed as parameter. If the returned value is true, the value will be pushed into the array. When the function is not provided, the element will be inserted regardless it is already in the array. |

#### Returns

[`Elements`](../modules.md#elements)<`T`[[`ClassArrayPropNames`](../modules.md#classarraypropnames)<`T`\>]\>

the inserted element or undefined if the element was not inserted.

#### Defined in

[persistent/entropic-component.ts:83](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/persistent/entropic-component.ts#L83)

___

### removeAndNotify

▸ `Protected` **removeAndNotify**<`T`\>(`arrayPropName`, `element`, `isEqual`): [`Elements`](../modules.md#elements)<`T`[[`ClassArrayPropNames`](../modules.md#classarraypropnames)<`T`\>]\>

Removes an element from an arbitrary array property of this class and fires
a change event on operation success.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`EntropicComponent`](EntropicComponent.md)<`T`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `arrayPropName` | [`ClassArrayPropNames`](../modules.md#classarraypropnames)<`T`\> | the name of the array property of this class where you want to insert the new element. |
| `element` | [`Elements`](../modules.md#elements)<`T`[[`ClassArrayPropNames`](../modules.md#classarraypropnames)<`T`\>]\> | the element to be inserted |
| `isEqual` | [`CompareFunction`](../modules.md#comparefunction)<`T`\> | a function that checks for equity of the two elements passed as parameter. If the returned value is true, the value will be removed from the array. |

#### Returns

[`Elements`](../modules.md#elements)<`T`[[`ClassArrayPropNames`](../modules.md#classarraypropnames)<`T`\>]\>

the removed element or undefined if the element was not removed.

#### Defined in

[persistent/entropic-component.ts:112](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/persistent/entropic-component.ts#L112)

___

### removeOnChange

▸ **removeOnChange**(`listenerCallback`): `void`

Removes the listener callback subscrition from the notifications.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `listenerCallback` | [`PropChangeCallback`](../modules.md#propchangecallback)<[`EntropicComponent`](EntropicComponent.md)\> | the listener callback to remove |

#### Returns

`void`

#### Defined in

[persistent/entropic-component.ts:34](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/persistent/entropic-component.ts#L34)

___

### setId

▸ `Protected` **setId**(`value`): `void`

Sets the id of this instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | the id of this instance |

#### Returns

`void`

#### Inherited from

[Persistent](Persistent.md).[setId](Persistent.md#setid)

#### Defined in

[persistent/persistent.ts:139](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/persistent/persistent.ts#L139)

___

### toObject

▸ **toObject**(): [`PersistentObject`](../modules.md#persistentobject)<[`EntropicComponent`](EntropicComponent.md)\>

Returns a plain object representation of this instance.
Only the properties that are not null or undefined will be copied.

**`See`**

 - fromObject
 - clone

#### Returns

[`PersistentObject`](../modules.md#persistentobject)<[`EntropicComponent`](EntropicComponent.md)\>

a plain object representation of this instance

#### Inherited from

[Persistent](Persistent.md).[toObject](Persistent.md#toobject)

#### Defined in

[persistent/persistent.ts:225](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/persistent/persistent.ts#L225)

___

### annotations

▸ `Static` **annotations**(`className`): `unknown`

Returns the annotation associated with a registered class

**`Throws`**

an error if the class is not registered

**`See`**

registerFactory

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `className` | `string` \| [`Persistent`](Persistent.md) \| [`PersistentConstructor`](../modules.md#persistentconstructor) | the name of the class to be retrieved |

#### Returns

`unknown`

the annotation associated with the class

#### Inherited from

[Persistent](Persistent.md).[annotations](Persistent.md#annotations)

#### Defined in

[persistent/persistent.ts:111](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/persistent/persistent.ts#L111)

___

### classFactory

▸ `Static` **classFactory**(`className`): [`PersistentConstructor`](../modules.md#persistentconstructor)

Returns the constructor of a registered class

**`Throws`**

an error if the class is not registered

**`See`**

 - registerFactory
 - registeredClasses
 - classesExtending
 - annotations

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `className` | `string` | the name of the class to be retrieved |

#### Returns

[`PersistentConstructor`](../modules.md#persistentconstructor)

the constructor of the class

#### Inherited from

[Persistent](Persistent.md).[classFactory](Persistent.md#classfactory)

#### Defined in

[persistent/persistent.ts:76](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/persistent/persistent.ts#L76)

___

### classesExtending

▸ `Static` **classesExtending**(`derivedFrom`): `string`[]

Returns the names of all registered classes that extend a given class

**`See`**

 - registerFactory
 - classFactory

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `derivedFrom` | `Function` \| [`PersistentConstructor`](../modules.md#persistentconstructor) | the class to be extended |

#### Returns

`string`[]

the names of all registered classes that extend the given class

#### Inherited from

[Persistent](Persistent.md).[classesExtending](Persistent.md#classesextending)

#### Defined in

[persistent/persistent.ts:98](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/persistent/persistent.ts#L98)

___

### createInstance

▸ `Static` **createInstance**<`T`\>(`obj`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Persistent`](Persistent.md)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `string` \| [`PersistentObject`](../modules.md#persistentobject)<`T`\> |

#### Returns

`T`

#### Inherited from

[Persistent](Persistent.md).[createInstance](Persistent.md#createinstance)

#### Defined in

[persistent/persistent.ts:384](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/persistent/persistent.ts#L384)

___

### registerFactory

▸ `Static` **registerFactory**(`className`, `factory`, `annotation?`): `void`

Registers a class to be used by the persistence engine.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `className` | `string` | the name of the class to be registered |
| `factory` | [`PersistentConstructor`](../modules.md#persistentconstructor) | the constructor of the registered class |
| `annotation?` | `unknown` | an annotation associated with the class |

#### Returns

`void`

#### Inherited from

[Persistent](Persistent.md).[registerFactory](Persistent.md#registerfactory)

#### Defined in

[persistent/persistent.ts:62](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/persistent/persistent.ts#L62)

___

### registeredClasses

▸ `Static` **registeredClasses**(): `string`[]

Returns the names of all registered classes

**`See`**

 - registerFactory
 - classFactory

#### Returns

`string`[]

the names of all registered classes

#### Inherited from

[Persistent](Persistent.md).[registeredClasses](Persistent.md#registeredclasses)

#### Defined in

[persistent/persistent.ts:87](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/persistent/persistent.ts#L87)
