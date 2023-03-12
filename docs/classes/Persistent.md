[entropic-bond](../README.md) / [Exports](../modules.md) / Persistent

# Class: Persistent

A class that provides several methods to serialize and deserialize objects.

## Hierarchy

- **`Persistent`**

  ↳ [`EntropicComponent`](EntropicComponent.md)

  ↳ [`StoredFile`](StoredFile.md)

## Table of contents

### Constructors

- [constructor](Persistent.md#constructor)

### Accessors

- [className](Persistent.md#classname)
- [id](Persistent.md#id)

### Methods

- [beforeSerialize](Persistent.md#beforeserialize)
- [clone](Persistent.md#clone)
- [fromObject](Persistent.md#fromobject)
- [getPersistentProperties](Persistent.md#getpersistentproperties)
- [onSerialized](Persistent.md#onserialized)
- [setId](Persistent.md#setid)
- [toObject](Persistent.md#toobject)
- [annotations](Persistent.md#annotations)
- [classFactory](Persistent.md#classfactory)
- [classesExtending](Persistent.md#classesextending)
- [createInstance](Persistent.md#createinstance)
- [registerFactory](Persistent.md#registerfactory)
- [registeredClasses](Persistent.md#registeredclasses)

## Constructors

### constructor

• **new Persistent**(`id?`)

Returns a new instance of Persistent class.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Defined in

[persistent/persistent.ts:124](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/persistent/persistent.ts#L124)

## Accessors

### className

• `get` **className**(): `string`

Gets the class name of this instance.

#### Returns

`string`

#### Defined in

[persistent/persistent.ts:131](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/persistent/persistent.ts#L131)

___

### id

• `get` **id**(): `string`

Returns the id of this instance.

#### Returns

`string`

the id of this instance

#### Defined in

[persistent/persistent.ts:147](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/persistent/persistent.ts#L147)

## Methods

### beforeSerialize

▸ `Protected` **beforeSerialize**(): `void`

This method is called by the persistence engine before the instance is
serialized.

#### Returns

`void`

#### Defined in

[persistent/persistent.ts:161](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/persistent/persistent.ts#L161)

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

#### Defined in

[persistent/persistent.ts:183](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/persistent/persistent.ts#L183)

___

### fromObject

▸ **fromObject**(`obj`): [`Persistent`](Persistent.md)

Initializes the persistent properties of this instance from the properties 
of given object.

**`See`**

 - clone
 - toObject

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `obj` | [`PersistentObject`](../modules.md#persistentobject)<[`Persistent`](Persistent.md)\> | the object to be copied |

#### Returns

[`Persistent`](Persistent.md)

this instance

#### Defined in

[persistent/persistent.ts:197](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/persistent/persistent.ts#L197)

___

### getPersistentProperties

▸ **getPersistentProperties**(): readonly `PersistentProperty`[]

Returns an array of the persistent properties of this instance.

#### Returns

readonly `PersistentProperty`[]

an array of the persistent properties of this instance

#### Defined in

[persistent/persistent.ts:167](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/persistent/persistent.ts#L167)

___

### onSerialized

▸ `Protected` **onSerialized**(): `void`

This method is called by the persistence engine when the instance has been
just serialized. It is called after the properties are initialized.

#### Returns

`void`

#### Defined in

[persistent/persistent.ts:155](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/persistent/persistent.ts#L155)

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

#### Defined in

[persistent/persistent.ts:139](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/persistent/persistent.ts#L139)

___

### toObject

▸ **toObject**(): [`PersistentObject`](../modules.md#persistentobject)<[`Persistent`](Persistent.md)\>

Returns a plain object representation of this instance.
Only the properties that are not null or undefined will be copied.

**`See`**

 - fromObject
 - clone

#### Returns

[`PersistentObject`](../modules.md#persistentobject)<[`Persistent`](Persistent.md)\>

a plain object representation of this instance

#### Defined in

[persistent/persistent.ts:225](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/persistent/persistent.ts#L225)

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

#### Defined in

[persistent/persistent.ts:111](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/persistent/persistent.ts#L111)

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

#### Defined in

[persistent/persistent.ts:76](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/persistent/persistent.ts#L76)

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

#### Defined in

[persistent/persistent.ts:98](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/persistent/persistent.ts#L98)

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

#### Defined in

[persistent/persistent.ts:384](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/persistent/persistent.ts#L384)

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

#### Defined in

[persistent/persistent.ts:62](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/persistent/persistent.ts#L62)

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

#### Defined in

[persistent/persistent.ts:87](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/persistent/persistent.ts#L87)
