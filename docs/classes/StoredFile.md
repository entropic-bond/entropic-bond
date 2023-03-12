[entropic-bond](../README.md) / [Exports](../modules.md) / StoredFile

# Class: StoredFile

A class that provides several methods to serialize and deserialize objects.

## Hierarchy

- [`Persistent`](Persistent.md)

  ↳ **`StoredFile`**

## Table of contents

### Constructors

- [constructor](StoredFile.md#constructor)

### Properties

- [\_cloudStorageProviderName](StoredFile.md#_cloudstorageprovidername)
- [\_onChange](StoredFile.md#_onchange)
- [\_originalFileName](StoredFile.md#_originalfilename)
- [\_pendingData](StoredFile.md#_pendingdata)
- [\_provider](StoredFile.md#_provider)
- [\_reference](StoredFile.md#_reference)
- [\_url](StoredFile.md#_url)

### Accessors

- [className](StoredFile.md#classname)
- [id](StoredFile.md#id)
- [originalFileName](StoredFile.md#originalfilename)
- [provider](StoredFile.md#provider)
- [url](StoredFile.md#url)

### Methods

- [beforeSerialize](StoredFile.md#beforeserialize)
- [clone](StoredFile.md#clone)
- [delete](StoredFile.md#delete)
- [fromObject](StoredFile.md#fromobject)
- [getPersistentProperties](StoredFile.md#getpersistentproperties)
- [onChange](StoredFile.md#onchange)
- [onSerialized](StoredFile.md#onserialized)
- [save](StoredFile.md#save)
- [setDataToStore](StoredFile.md#setdatatostore)
- [setId](StoredFile.md#setid)
- [toObject](StoredFile.md#toobject)
- [uploadControl](StoredFile.md#uploadcontrol)
- [annotations](StoredFile.md#annotations)
- [classFactory](StoredFile.md#classfactory)
- [classesExtending](StoredFile.md#classesextending)
- [createInstance](StoredFile.md#createinstance)
- [registerFactory](StoredFile.md#registerfactory)
- [registeredClasses](StoredFile.md#registeredclasses)

## Constructors

### constructor

• **new StoredFile**(`id?`)

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

### \_cloudStorageProviderName

• `Private` **\_cloudStorageProviderName**: `string`

#### Defined in

[cloud-storage/stored-file.ts:91](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/cloud-storage/stored-file.ts#L91)

___

### \_onChange

• `Private` **\_onChange**: [`Observable`](Observable.md)<[`StoredFileChange`](../interfaces/StoredFileChange.md)\>

#### Defined in

[cloud-storage/stored-file.ts:95](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/cloud-storage/stored-file.ts#L95)

___

### \_originalFileName

• `Private` **\_originalFileName**: `string`

#### Defined in

[cloud-storage/stored-file.ts:92](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/cloud-storage/stored-file.ts#L92)

___

### \_pendingData

• `Private` **\_pendingData**: [`StorableData`](../modules.md#storabledata)

#### Defined in

[cloud-storage/stored-file.ts:94](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/cloud-storage/stored-file.ts#L94)

___

### \_provider

• `Private` **\_provider**: [`CloudStorage`](CloudStorage.md)

#### Defined in

[cloud-storage/stored-file.ts:93](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/cloud-storage/stored-file.ts#L93)

___

### \_reference

• `Private` **\_reference**: `string`

#### Defined in

[cloud-storage/stored-file.ts:89](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/cloud-storage/stored-file.ts#L89)

___

### \_url

• `Private` **\_url**: `string`

#### Defined in

[cloud-storage/stored-file.ts:90](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/cloud-storage/stored-file.ts#L90)

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

___

### originalFileName

• `get` **originalFileName**(): `string`

#### Returns

`string`

#### Defined in

[cloud-storage/stored-file.ts:81](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/cloud-storage/stored-file.ts#L81)

___

### provider

• `get` **provider**(): [`CloudStorage`](CloudStorage.md)

#### Returns

[`CloudStorage`](CloudStorage.md)

#### Defined in

[cloud-storage/stored-file.ts:54](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/cloud-storage/stored-file.ts#L54)

• `set` **provider**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`CloudStorage`](CloudStorage.md) |

#### Returns

`void`

#### Defined in

[cloud-storage/stored-file.ts:49](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/cloud-storage/stored-file.ts#L49)

___

### url

• `get` **url**(): `string`

#### Returns

`string`

#### Defined in

[cloud-storage/stored-file.ts:66](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/cloud-storage/stored-file.ts#L66)

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

### delete

▸ **delete**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[cloud-storage/stored-file.ts:41](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/cloud-storage/stored-file.ts#L41)

___

### fromObject

▸ **fromObject**(`obj`): [`StoredFile`](StoredFile.md)

Initializes the persistent properties of this instance from the properties 
of given object.

**`See`**

 - clone
 - toObject

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `obj` | [`PersistentObject`](../modules.md#persistentobject)<[`StoredFile`](StoredFile.md)\> | the object to be copied |

#### Returns

[`StoredFile`](StoredFile.md)

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

### onChange

▸ **onChange**(`listenerCallback`): [`Unsubscriber`](../modules.md#unsubscriber)

#### Parameters

| Name | Type |
| :------ | :------ |
| `listenerCallback` | [`Callback`](../modules.md#callback)<[`StoredFileChange`](../interfaces/StoredFileChange.md)\> |

#### Returns

[`Unsubscriber`](../modules.md#unsubscriber)

#### Defined in

[cloud-storage/stored-file.ts:85](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/cloud-storage/stored-file.ts#L85)

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

### save

▸ **save**(`«destructured»?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`StoreParams`](../interfaces/StoreParams.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[cloud-storage/stored-file.ts:22](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/cloud-storage/stored-file.ts#L22)

___

### setDataToStore

▸ **setDataToStore**(`data`): [`StoredFile`](StoredFile.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`StorableData`](../modules.md#storabledata) |

#### Returns

[`StoredFile`](StoredFile.md)

#### Defined in

[cloud-storage/stored-file.ts:70](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/cloud-storage/stored-file.ts#L70)

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

▸ **toObject**(): [`PersistentObject`](../modules.md#persistentobject)<[`StoredFile`](StoredFile.md)\>

Returns a plain object representation of this instance.
Only the properties that are not null or undefined will be copied.

**`See`**

 - fromObject
 - clone

#### Returns

[`PersistentObject`](../modules.md#persistentobject)<[`StoredFile`](StoredFile.md)\>

a plain object representation of this instance

#### Inherited from

[Persistent](Persistent.md).[toObject](Persistent.md#toobject)

#### Defined in

[persistent/persistent.ts:225](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/persistent/persistent.ts#L225)

___

### uploadControl

▸ **uploadControl**(): [`UploadControl`](../interfaces/UploadControl.md)

#### Returns

[`UploadControl`](../interfaces/UploadControl.md)

#### Defined in

[cloud-storage/stored-file.ts:37](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/cloud-storage/stored-file.ts#L37)

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
