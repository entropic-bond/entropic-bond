[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / EntropicComponent

# Class: EntropicComponent

Defined in: [persistent/entropic-component.ts:19](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/entropic-component.ts#L19)

A class that provides several methods to serialize and deserialize objects.

## Extends

- [`Persistent`](Persistent.md)

## Constructors

### Constructor

> **new EntropicComponent**(`id?`): `EntropicComponent`

Defined in: [persistent/persistent.ts:170](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L170)

Returns a new instance of Persistent class.

#### Parameters

##### id?

`string` = `...`

the initial id of this instance. If not provided, a new id will be generated

#### Returns

`EntropicComponent`

#### Inherited from

[`Persistent`](Persistent.md).[`constructor`](Persistent.md#constructor)

## Accessors

### className

#### Get Signature

> **get** **className**(): `string`

Defined in: [persistent/persistent.ts:177](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L177)

Gets the class name of this instance.

##### Returns

`string`

#### Inherited from

[`Persistent`](Persistent.md).[`className`](Persistent.md#classname)

***

### id

#### Get Signature

> **get** **id**(): `string`

Defined in: [persistent/persistent.ts:193](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L193)

Returns the id of this instance.

##### Returns

`string`

the id of this instance

#### Inherited from

[`Persistent`](Persistent.md).[`id`](Persistent.md#id)

## Methods

### afterDeserialize()

> `protected` **afterDeserialize**(): `void`

Defined in: [persistent/persistent.ts:202](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L202)

This method is called by the persistence engine when the instance has been
just serialized. It is called after the properties are initialized with 
serialized data.

#### Returns

`void`

#### Inherited from

[`Persistent`](Persistent.md).[`afterDeserialize`](Persistent.md#afterdeserialize)

***

### beforeSerialize()

> `protected` **beforeSerialize**(): `void`

Defined in: [persistent/persistent.ts:208](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L208)

This method is called by the persistence engine before the instance is
serialized.

#### Returns

`void`

#### Inherited from

[`Persistent`](Persistent.md).[`beforeSerialize`](Persistent.md#beforeserialize)

***

### changeProp()

> `protected` **changeProp**\<`P`\>(`propName`, `value`): `boolean`

Defined in: [persistent/entropic-component.ts:49](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/entropic-component.ts#L49)

Changes the value of the property and notifies the subscribers about the change.
This is a helper method that can be used in the property setter.

#### Type Parameters

##### P

`P` *extends* keyof `EntropicComponent`

#### Parameters

##### propName

`P`

the name of the property to be changed

##### value

`EntropicComponent`\[`P`\]

the new value for the property

#### Returns

`boolean`

true in case the property has been effectively changed, false otherwise

***

### clone()

> **clone**(`instance`): `this`

Defined in: [persistent/persistent.ts:268](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L268)

Copy the persistent properties of the given instance to this instance. 
The property `id` will be ignored.
Only the properties that are not null or undefined will be copied.

#### Parameters

##### instance

[`Persistent`](Persistent.md)

the instance to be copied

#### Returns

`this`

this instance

#### See

 - fromObject
 - toObject

#### Inherited from

[`Persistent`](Persistent.md).[`clone`](Persistent.md#clone)

***

### fromObject()

> **fromObject**(`obj`): `this`

Defined in: [persistent/persistent.ts:282](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L282)

Initializes the persistent properties of this instance from the properties 
of given object.

#### Parameters

##### obj

`Record`\<`string`, `unknown`\> \| `Partial`\<[`PersistentObject`](../type-aliases/PersistentObject.md)\<`EntropicComponent`\>\>

the object to be copied

#### Returns

`this`

this instance

#### See

 - clone
 - toObject

#### Inherited from

[`Persistent`](Persistent.md).[`fromObject`](Persistent.md#fromobject)

***

### getPersistentProperties()

> **getPersistentProperties**(): readonly [`PersistentProperty`](../interfaces/PersistentProperty.md)[]

Defined in: [persistent/persistent.ts:214](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L214)

Returns an array of the persistent properties of this instance.

#### Returns

readonly [`PersistentProperty`](../interfaces/PersistentProperty.md)[]

an array of the persistent properties of this instance

#### Inherited from

[`Persistent`](Persistent.md).[`getPersistentProperties`](Persistent.md#getpersistentproperties)

***

### getPropInfo()

> **getPropInfo**\<`T`\>(`propName`): [`PersistentProperty`](../interfaces/PersistentProperty.md)

Defined in: [persistent/persistent.ts:227](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L227)

Get the property information of this instance

#### Type Parameters

##### T

`T` *extends* `EntropicComponent`

#### Parameters

##### propName

[`ClassPropNames`](../type-aliases/ClassPropNames.md)\<`T`\>

the persistent property name

#### Returns

[`PersistentProperty`](../interfaces/PersistentProperty.md)

the property information

#### Inherited from

[`Persistent`](Persistent.md).[`getPropInfo`](Persistent.md#getpropinfo)

***

### isPropValueValid()

> **isPropValueValid**\<`T`\>(`propName`): `boolean`

Defined in: [persistent/persistent.ts:253](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L253)

Query if the property value is valid
Define the validator function using the [required](../functions/required.md) decorator

#### Type Parameters

##### T

`T` *extends* `EntropicComponent`

#### Parameters

##### propName

[`ClassPropNames`](../type-aliases/ClassPropNames.md)\<`T`\>

the persistent property name

#### Returns

`boolean`

true if the property value is valid using the validator function
passed to the [required](../functions/required.md) decorator

#### See

required

#### Inherited from

[`Persistent`](Persistent.md).[`isPropValueValid`](Persistent.md#ispropvaluevalid)

***

### isRequired()

> **isRequired**\<`T`\>(`propName`): `boolean`

Defined in: [persistent/persistent.ts:240](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L240)

Query if the property is required
To mark a property as required, use the [required](../functions/required.md) decorator

#### Type Parameters

##### T

`T` *extends* `EntropicComponent`

#### Parameters

##### propName

[`ClassPropNames`](../type-aliases/ClassPropNames.md)\<`T`\>

the persistent property name

#### Returns

`boolean`

true if the property is required

#### See

required

#### Inherited from

[`Persistent`](Persistent.md).[`isRequired`](Persistent.md#isrequired)

***

### notify()

> `protected` **notify**\<`T`\>(`event`): `void`

Defined in: [persistent/entropic-component.ts:67](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/entropic-component.ts#L67)

Notifies the subscribers a property or group of properties change.
This is a helper function to be used when you want to notify property changes.

#### Type Parameters

##### T

`T` *extends* `EntropicComponent`

#### Parameters

##### event

[`PropChangeEvent`](../type-aliases/PropChangeEvent.md)\<`T`\>

the event with the changed properties

#### Returns

`void`

***

### onChange()

> **onChange**(`listenerCallback`): [`Unsubscriber`](../type-aliases/Unsubscriber.md)

Defined in: [persistent/entropic-component.ts:28](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/entropic-component.ts#L28)

Subscribes a listener callback function. Every time a property is changed, 
the listener callback will be called with the property change event.

#### Parameters

##### listenerCallback

[`PropChangeCallback`](../type-aliases/PropChangeCallback.md)\<`EntropicComponent`\>

the listener callback

#### Returns

[`Unsubscriber`](../type-aliases/Unsubscriber.md)

a function to unsubscribe the listener from further notifications

***

### pushAndNotify()

> `protected` **pushAndNotify**\<`T`, `E`\>(`this`, `arrayPropName`, `element`, `isUnique?`): `E` \| `undefined`

Defined in: [persistent/entropic-component.ts:86](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/entropic-component.ts#L86)

Inserts a new element in an arbitrary array property of this class and 
fires a change event if successfully inserted. To avoid repeated elements
to be inserted, you can pass a function that checks for inequity.

#### Type Parameters

##### T

`T` *extends* keyof `EntropicComponent`

##### E

`E`

#### Parameters

##### this

`Record`\<`T`, readonly `E`[]\> & `EntropicComponent`

##### arrayPropName

`T`

the name of the array property of this class where you
											want to insert the	new element.

##### element

[`StrictElement`](../type-aliases/StrictElement.md)\<`E`\>

the element to be inserted

##### isUnique?

[`CompareFunction`](../type-aliases/CompareFunction.md)\<[`StrictElement`](../type-aliases/StrictElement.md)\<`E`\>\>

a function that checks for inequity of the two elements 
									passed as parameter. If the returned value is true, the 
									value will be	pushed into the array. When the function is 
									not provided, the element will be inserted regardless it is
									already in the array.

#### Returns

`E` \| `undefined`

the inserted element or undefined if the element was not inserted.

***

### removeAndNotify()

> `protected` **removeAndNotify**\<`T`, `E`\>(`this`, `arrayPropName`, `element`, `isEqual`): `E` \| `undefined`

Defined in: [persistent/entropic-component.ts:117](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/entropic-component.ts#L117)

Removes an element from an arbitrary array property of this class and fires
a change event on operation success.

#### Type Parameters

##### T

`T` *extends* keyof `EntropicComponent`

##### E

`E`

#### Parameters

##### this

`Record`\<`T`, readonly `E`[]\> & `EntropicComponent`

##### arrayPropName

`T`

the name of the array property of this class where you
											want to insert the	new element.

##### element

[`StrictElement`](../type-aliases/StrictElement.md)\<`E`\>

the element to be inserted

##### isEqual

[`CompareFunction`](../type-aliases/CompareFunction.md)\<[`StrictElement`](../type-aliases/StrictElement.md)\<`E`\>\>

a function that checks for equity of the two elements 
									passed as parameter. If the returned value is true, the 
									value will be	removed from the array.

#### Returns

`E` \| `undefined`

the removed element or undefined if the element was not removed.

***

### removeOnChange()

> **removeOnChange**(`listenerCallback`): `void`

Defined in: [persistent/entropic-component.ts:37](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/entropic-component.ts#L37)

Removes the listener callback subscrition from the notifications.

#### Parameters

##### listenerCallback

[`PropChangeCallback`](../type-aliases/PropChangeCallback.md)\<`EntropicComponent`\>

the listener callback to remove

#### Returns

`void`

***

### setId()

> `protected` **setId**(`value`): `void`

Defined in: [persistent/persistent.ts:185](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L185)

Sets the id of this instance.

#### Parameters

##### value

`string`

the id of this instance

#### Returns

`void`

#### Inherited from

[`Persistent`](Persistent.md).[`setId`](Persistent.md#setid)

***

### toObject()

> **toObject**(): [`PersistentObject`](../type-aliases/PersistentObject.md)\<`EntropicComponent`\>

Defined in: [persistent/persistent.ts:311](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L311)

Returns a plain object representation of this instance.
Only the properties that are not null or undefined will be copied.

#### Returns

[`PersistentObject`](../type-aliases/PersistentObject.md)\<`EntropicComponent`\>

a plain object representation of this instance

#### See

 - fromObject
 - clone

#### Inherited from

[`Persistent`](Persistent.md).[`toObject`](Persistent.md#toobject)

***

### annotations()

> `static` **annotations**(`className`): `unknown`

Defined in: [persistent/persistent.ts:157](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L157)

Returns the annotation associated with a registered class

#### Parameters

##### className

`string` \| [`Persistent`](Persistent.md) \| [`PersistentConstructor`](../type-aliases/PersistentConstructor.md)

the name of the class to be retrieved

#### Returns

`unknown`

the annotation associated with the class

#### Throws

an error if the class is not registered

#### See

registerFactory

#### Inherited from

[`Persistent`](Persistent.md).[`annotations`](Persistent.md#annotations)

***

### classesExtending()

> `static` **classesExtending**(`derivedFrom`): `string`[]

Defined in: [persistent/persistent.ts:125](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L125)

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

#### Inherited from

[`Persistent`](Persistent.md).[`classesExtending`](Persistent.md#classesextending)

***

### classFactory()

> `static` **classFactory**(`className`): [`PersistentConstructor`](../type-aliases/PersistentConstructor.md)

Defined in: [persistent/persistent.ts:90](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L90)

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

#### Inherited from

[`Persistent`](Persistent.md).[`classFactory`](Persistent.md#classfactory)

***

### collectionPath()

> `static` **collectionPath**(`propInstance`, `prop`, `params?`): `string`

Defined in: [persistent/persistent.ts:417](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L417)

#### Parameters

##### propInstance

[`Persistent`](Persistent.md)

##### prop

[`PersistentProperty`](../interfaces/PersistentProperty.md)

##### params?

`unknown`

#### Returns

`string`

#### Inherited from

[`Persistent`](Persistent.md).[`collectionPath`](Persistent.md#collectionpath)

***

### createInstance()

> `static` **createInstance**\<`T`\>(`obj`): `T`

Defined in: [persistent/persistent.ts:485](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L485)

#### Type Parameters

##### T

`T` *extends* [`Persistent`](Persistent.md)

#### Parameters

##### obj

`string` \| [`PersistentObject`](../type-aliases/PersistentObject.md)\<`T`\>

#### Returns

`T`

#### Inherited from

[`Persistent`](Persistent.md).[`createInstance`](Persistent.md#createinstance)

***

### createReference()

> `static` **createReference**\<`T`\>(`obj`): `T`

Defined in: [persistent/persistent.ts:479](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L479)

#### Type Parameters

##### T

`T` *extends* [`Persistent`](Persistent.md)

#### Parameters

##### obj

`string` \| [`PersistentObject`](../type-aliases/PersistentObject.md)\<`T`\>

#### Returns

`T`

#### Inherited from

[`Persistent`](Persistent.md).[`createReference`](Persistent.md#createreference)

***

### getSystemRegisteredReferencesWithCachedProps()

> `static` **getSystemRegisteredReferencesWithCachedProps**(): [`PersistentPropertyCollection`](../type-aliases/PersistentPropertyCollection.md)

Defined in: [persistent/persistent.ts:540](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L540)

Retrieves a collection of references with the properties that are stored in the reference object

#### Returns

[`PersistentPropertyCollection`](../type-aliases/PersistentPropertyCollection.md)

the references collection

#### Inherited from

[`Persistent`](Persistent.md).[`getSystemRegisteredReferencesWithCachedProps`](Persistent.md#getsystemregisteredreferenceswithcachedprops)

***

### isInstanceOf()

> `static` **isInstanceOf**(`value`, `className`): `boolean`

Defined in: [persistent/persistent.ts:142](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L142)

Emulates the `instanceof` operator for a registered class. 
This is useful when you want to check if an object or named class is an 
instance of a registered class without having to import the class.

#### Parameters

##### value

`string` \| [`Persistent`](Persistent.md) \| [`PersistentObject`](../type-aliases/PersistentObject.md)\<[`Persistent`](Persistent.md)\>

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

#### Inherited from

[`Persistent`](Persistent.md).[`isInstanceOf`](Persistent.md#isinstanceof)

***

### propInfo()

> `static` **propInfo**\<`T`\>(`registeredClassName`, `propName`): [`PersistentProperty`](../interfaces/PersistentProperty.md)

Defined in: [persistent/persistent.ts:504](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L504)

#### Type Parameters

##### T

`T` *extends* [`Persistent`](Persistent.md)

#### Parameters

##### registeredClassName

`string`

##### propName

[`ClassPropNames`](../type-aliases/ClassPropNames.md)\<`T`\>

#### Returns

[`PersistentProperty`](../interfaces/PersistentProperty.md)

#### Inherited from

[`Persistent`](Persistent.md).[`propInfo`](Persistent.md#propinfo)

***

### propType()

> `static` **propType**(`propInfo`): `string`

Defined in: [persistent/persistent.ts:519](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L519)

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

#### Inherited from

[`Persistent`](Persistent.md).[`propType`](Persistent.md#proptype)

***

### registeredClasses()

> `static` **registeredClasses**(): `string`[]

Defined in: [persistent/persistent.ts:102](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L102)

Returns the names of all registered classes

#### Returns

`string`[]

the names of all registered classes

#### See

 - registerFactory
 - classFactory

#### Inherited from

[`Persistent`](Persistent.md).[`registeredClasses`](Persistent.md#registeredclasses)

***

### registeredClassesAndLegacyNames()

> `static` **registeredClassesAndLegacyNames**(): `string`[]

Defined in: [persistent/persistent.ts:114](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L114)

Returns the names of all registered classes, including legacy names

#### Returns

`string`[]

the names of all registered classes, including legacy names

#### See

 - registerFactory
 - classFactory

#### Inherited from

[`Persistent`](Persistent.md).[`registeredClassesAndLegacyNames`](Persistent.md#registeredclassesandlegacynames)

***

### registerFactory()

> `static` **registerFactory**(`className`, `factory`, `annotation?`, `isLegacy?`): `void`

Defined in: [persistent/persistent.ts:76](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L76)

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

#### Inherited from

[`Persistent`](Persistent.md).[`registerFactory`](Persistent.md#registerfactory)

***

### searchableArrayNameFor()

> `static` **searchableArrayNameFor**(`propName`): `string`

Defined in: [persistent/persistent.ts:353](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L353)

#### Parameters

##### propName

`string`

#### Returns

`string`

#### Inherited from

[`Persistent`](Persistent.md).[`searchableArrayNameFor`](Persistent.md#searchablearraynamefor)
