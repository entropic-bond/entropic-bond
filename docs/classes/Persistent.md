[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / Persistent

# Class: Persistent

Defined in: [persistent/persistent.ts:68](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L68)

A class that provides several methods to serialize and deserialize objects.

## Extended by

- [`EntropicComponent`](EntropicComponent.md)
- [`StoredFile`](StoredFile.md)

## Constructors

### Constructor

> **new Persistent**(`id?`): `Persistent`

Defined in: [persistent/persistent.ts:170](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L170)

Returns a new instance of Persistent class.

#### Parameters

##### id?

`string` = `...`

the initial id of this instance. If not provided, a new id will be generated

#### Returns

`Persistent`

## Accessors

### className

#### Get Signature

> **get** **className**(): `string`

Defined in: [persistent/persistent.ts:177](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L177)

Gets the class name of this instance.

##### Returns

`string`

***

### id

#### Get Signature

> **get** **id**(): `string`

Defined in: [persistent/persistent.ts:193](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L193)

Returns the id of this instance.

##### Returns

`string`

the id of this instance

## Methods

### afterDeserialize()

> `protected` **afterDeserialize**(): `void`

Defined in: [persistent/persistent.ts:202](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L202)

This method is called by the persistence engine when the instance has been
just serialized. It is called after the properties are initialized with 
serialized data.

#### Returns

`void`

***

### beforeSerialize()

> `protected` **beforeSerialize**(): `void`

Defined in: [persistent/persistent.ts:208](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L208)

This method is called by the persistence engine before the instance is
serialized.

#### Returns

`void`

***

### clone()

> **clone**(`instance`): `this`

Defined in: [persistent/persistent.ts:268](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L268)

Copy the persistent properties of the given instance to this instance. 
The property `id` will be ignored.
Only the properties that are not null or undefined will be copied.

#### Parameters

##### instance

`Persistent`

the instance to be copied

#### Returns

`this`

this instance

#### See

 - fromObject
 - toObject

***

### fromObject()

> **fromObject**(`obj`): `this`

Defined in: [persistent/persistent.ts:282](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L282)

Initializes the persistent properties of this instance from the properties 
of given object.

#### Parameters

##### obj

`Record`\<`string`, `unknown`\> \| `Partial`\<[`PersistentObject`](../type-aliases/PersistentObject.md)\<`Persistent`\>\>

the object to be copied

#### Returns

`this`

this instance

#### See

 - clone
 - toObject

***

### getPersistentProperties()

> **getPersistentProperties**(): readonly [`PersistentProperty`](../interfaces/PersistentProperty.md)[]

Defined in: [persistent/persistent.ts:214](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L214)

Returns an array of the persistent properties of this instance.

#### Returns

readonly [`PersistentProperty`](../interfaces/PersistentProperty.md)[]

an array of the persistent properties of this instance

***

### getPropInfo()

> **getPropInfo**\<`T`\>(`propName`): [`PersistentProperty`](../interfaces/PersistentProperty.md)

Defined in: [persistent/persistent.ts:227](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L227)

Get the property information of this instance

#### Type Parameters

##### T

`T` *extends* `Persistent`

#### Parameters

##### propName

[`ClassPropNames`](../type-aliases/ClassPropNames.md)\<`T`\>

the persistent property name

#### Returns

[`PersistentProperty`](../interfaces/PersistentProperty.md)

the property information

***

### isPropValueValid()

> **isPropValueValid**\<`T`\>(`propName`): `boolean`

Defined in: [persistent/persistent.ts:253](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L253)

Query if the property value is valid
Define the validator function using the

#### Type Parameters

##### T

`T` *extends* `Persistent`

#### Parameters

##### propName

[`ClassPropNames`](../type-aliases/ClassPropNames.md)\<`T`\>

the persistent property name

#### Returns

`boolean`

true if the property value is valid using the validator function
passed to the

#### Required

decorator

#### Required

decorator

#### See

required

***

### isRequired()

> **isRequired**\<`T`\>(`propName`): `boolean`

Defined in: [persistent/persistent.ts:240](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L240)

Query if the property is required
To mark a property as required, use the

#### Type Parameters

##### T

`T` *extends* `Persistent`

#### Parameters

##### propName

[`ClassPropNames`](../type-aliases/ClassPropNames.md)\<`T`\>

the persistent property name

#### Returns

`boolean`

true if the property is required

#### Required

decorator

#### See

required

***

### setId()

> `protected` **setId**(`value`): `void`

Defined in: [persistent/persistent.ts:185](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L185)

Sets the id of this instance.

#### Parameters

##### value

`string`

the id of this instance

#### Returns

`void`

***

### toObject()

> **toObject**(): [`PersistentObject`](../type-aliases/PersistentObject.md)\<`Persistent`\>

Defined in: [persistent/persistent.ts:311](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L311)

Returns a plain object representation of this instance.
Only the properties that are not null or undefined will be copied.

#### Returns

[`PersistentObject`](../type-aliases/PersistentObject.md)\<`Persistent`\>

a plain object representation of this instance

#### See

 - fromObject
 - clone

***

### annotations()

> `static` **annotations**(`className`): `unknown`

Defined in: [persistent/persistent.ts:157](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L157)

Returns the annotation associated with a registered class

#### Parameters

##### className

`string` \| `Persistent` \| [`PersistentConstructor`](../type-aliases/PersistentConstructor.md)

the name of the class to be retrieved

#### Returns

`unknown`

the annotation associated with the class

#### Throws

an error if the class is not registered

#### See

registerFactory

***

### classesExtending()

> `static` **classesExtending**(`derivedFrom`): `string`[]

Defined in: [persistent/persistent.ts:125](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L125)

Returns the names of all registered classes that extend a given class

#### Parameters

##### derivedFrom

`Function` \| [`PersistentConstructor`](../type-aliases/PersistentConstructor.md)

the parent class to be queried

#### Returns

`string`[]

the names of all registered classes that extend the given class

#### See

 - registerFactory
 - classFactory

***

### classFactory()

> `static` **classFactory**(`className`): [`PersistentConstructor`](../type-aliases/PersistentConstructor.md)

Defined in: [persistent/persistent.ts:90](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L90)

Returns the constructor of a registered class

#### Parameters

##### className

`string` \| `undefined`

the name of the class to be retrieved

#### Returns

[`PersistentConstructor`](../type-aliases/PersistentConstructor.md)

the constructor of the class

#### Throws

an error if the class is not registered

#### See

 - registerFactory
 - registeredClasses
 - classesExtending
 - annotations

***

### collectionPath()

> `static` **collectionPath**(`propInstance`, `prop`, `params?`): `string`

Defined in: [persistent/persistent.ts:417](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L417)

#### Parameters

##### propInstance

`Persistent`

##### prop

[`PersistentProperty`](../interfaces/PersistentProperty.md)

##### params?

`unknown`

#### Returns

`string`

***

### createInstance()

> `static` **createInstance**\<`T`\>(`obj`): `T`

Defined in: [persistent/persistent.ts:485](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L485)

#### Type Parameters

##### T

`T` *extends* `Persistent`

#### Parameters

##### obj

`string` \| [`PersistentObject`](../type-aliases/PersistentObject.md)\<`T`\>

#### Returns

`T`

***

### createReference()

> `static` **createReference**\<`T`\>(`obj`): `T`

Defined in: [persistent/persistent.ts:479](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L479)

#### Type Parameters

##### T

`T` *extends* `Persistent`

#### Parameters

##### obj

`string` \| [`PersistentObject`](../type-aliases/PersistentObject.md)\<`T`\>

#### Returns

`T`

***

### getSystemRegisteredReferencesWithCachedProps()

> `static` **getSystemRegisteredReferencesWithCachedProps**(): [`PersistentPropertyCollection`](../type-aliases/PersistentPropertyCollection.md)

Defined in: [persistent/persistent.ts:540](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L540)

Retrieves a collection of references with the properties that are stored in the reference object

#### Returns

[`PersistentPropertyCollection`](../type-aliases/PersistentPropertyCollection.md)

the references collection

***

### isInstanceOf()

> `static` **isInstanceOf**(`value`, `className`): `boolean`

Defined in: [persistent/persistent.ts:142](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L142)

Emulates the `instanceof` operator for a registered class. 
This is useful when you want to check if an object or named class is an 
instance of a registered class without having to import the class.

#### Parameters

##### value

`string` \| `Persistent` \| [`PersistentObject`](../type-aliases/PersistentObject.md)\<`Persistent`\>

the object or named class to be checked

##### className

`string`

the name of the class to be checked against

#### Returns

`boolean`

true if the object or named class is an instance of the registered class

#### See

 - registerFactory
 - classFactory
 - classesExtending

***

### propInfo()

> `static` **propInfo**\<`T`\>(`registeredClassName`, `propName`): [`PersistentProperty`](../interfaces/PersistentProperty.md)

Defined in: [persistent/persistent.ts:504](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L504)

#### Type Parameters

##### T

`T` *extends* `Persistent`

#### Parameters

##### registeredClassName

`string`

##### propName

[`ClassPropNames`](../type-aliases/ClassPropNames.md)\<`T`\>

#### Returns

[`PersistentProperty`](../interfaces/PersistentProperty.md)

***

### propType()

> `static` **propType**(`propInfo`): `string`

Defined in: [persistent/persistent.ts:519](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L519)

Return the type of a persistent property.
Several strategies are used to determine the type:
- If the typeName is defined in the property info a decorator, it is used
- If the property value is an array, the type of the first element is used
- If the property value is a Persistent instance, its class name is used
- Otherwise, the typeof operator is used to determine the type

#### Parameters

##### propInfo

[`PersistentProperty`](../interfaces/PersistentProperty.md)

the persistent property info to retrieve the type

#### Returns

`string`

the type of the property or the type of the first element if the property is an array or undefined if cannot be determined

***

### registeredClasses()

> `static` **registeredClasses**(): `string`[]

Defined in: [persistent/persistent.ts:102](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L102)

Returns the names of all registered classes

#### Returns

`string`[]

the names of all registered classes

#### See

 - registerFactory
 - classFactory

***

### registeredClassesAndLegacyNames()

> `static` **registeredClassesAndLegacyNames**(): `string`[]

Defined in: [persistent/persistent.ts:114](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L114)

Returns the names of all registered classes, including legacy names

#### Returns

`string`[]

the names of all registered classes, including legacy names

#### See

 - registerFactory
 - classFactory

***

### registerFactory()

> `static` **registerFactory**(`className`, `factory`, `annotation?`, `isLegacy?`): `void`

Defined in: [persistent/persistent.ts:76](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L76)

Registers a class to be used by the persistence engine.

#### Parameters

##### className

`string`

the name of the class to be registered

##### factory

[`PersistentConstructor`](../type-aliases/PersistentConstructor.md)

the constructor of the registered class

##### annotation?

`unknown`

an annotation associated with the class

##### isLegacy?

`boolean` = `false`

#### Returns

`void`

***

### searchableArrayNameFor()

> `static` **searchableArrayNameFor**(`propName`): `string`

Defined in: [persistent/persistent.ts:353](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L353)

#### Parameters

##### propName

`string`

#### Returns

`string`
