[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / CachedPropsUpdater

# Class: CachedPropsUpdater

Defined in: [store/cached-props-updater.ts:27](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/cached-props-updater.ts#L27)

## Constructors

### Constructor

> **new CachedPropsUpdater**(`config?`): `CachedPropsUpdater`

Defined in: [store/cached-props-updater.ts:28](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/cached-props-updater.ts#L28)

#### Parameters

##### config?

[`CachedPropsUpdaterConfig`](../interfaces/CachedPropsUpdaterConfig.md)

#### Returns

`CachedPropsUpdater`

## Accessors

### afterDocumentChange

#### Set Signature

> **set** **afterDocumentChange**(`callback`): `void`

Defined in: [store/cached-props-updater.ts:71](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/cached-props-updater.ts#L71)

Set a callback to be executed after updating each document that has a cached prop to update. 
The callback receives the document that was updated and the prop that triggered the update as parameters.

##### Parameters

###### callback

[`AfterDocumentChangeCallback`](../type-aliases/AfterDocumentChangeCallback.md)

The callback to be executed after updating each document that has a cached prop to update.

##### Returns

`void`

***

### afterUpdateDocument

#### Set Signature

> **set** **afterUpdateDocument**(`callback`): `void`

Defined in: [store/cached-props-updater.ts:89](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/cached-props-updater.ts#L89)

Set a callback to be executed after updating each document that has a cached prop to update.
The callback receives the document that was updated and the prop that triggered the update as parameters.

##### Parameters

###### callback

[`CachedPropsUpdaterCallback`](../type-aliases/CachedPropsUpdaterCallback.md)

The callback to be executed after updating each document that has a cached prop to update.

##### Returns

`void`

***

### beforeDocumentChange

#### Set Signature

> **set** **beforeDocumentChange**(`callback`): `void`

Defined in: [store/cached-props-updater.ts:62](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/cached-props-updater.ts#L62)

Set a callback to be executed before updating each document that has a cached prop to update. 
The callback receives the document to update and the prop that triggered the update as parameters.

##### Parameters

###### callback

[`BeforeDocumentChangeCallback`](../type-aliases/BeforeDocumentChangeCallback.md)

The callback to be executed before updating each document that has a cached prop to update.

##### Returns

`void`

***

### beforeQueryOwnerCollection

#### Set Signature

> **set** **beforeQueryOwnerCollection**(`subscriber`): `void`

Defined in: [store/cached-props-updater.ts:93](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/cached-props-updater.ts#L93)

##### Parameters

###### subscriber

[`BeforeQueryOwnerCollection`](../type-aliases/BeforeQueryOwnerCollection.md)

##### Returns

`void`

***

### beforeUpdateDocument

#### Set Signature

> **set** **beforeUpdateDocument**(`callback`): `void`

Defined in: [store/cached-props-updater.ts:80](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/cached-props-updater.ts#L80)

Set a callback to be executed before updating each document that has a cached prop to update.
The callback receives the document to update and the prop that triggered the update as parameters.

##### Parameters

###### callback

[`CachedPropsUpdaterCallback`](../type-aliases/CachedPropsUpdaterCallback.md)

The callback to be executed before updating each document that has a cached prop to update.

##### Returns

`void`

***

### collectionsToWatch

#### Get Signature

> **get** **collectionsToWatch**(): `Readonly`\<[`Collection`](../interfaces/Collection.md)\<[`PersistentProperty`](../interfaces/PersistentProperty.md)[]\>\>

Defined in: [store/cached-props-updater.ts:101](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/cached-props-updater.ts#L101)

##### Returns

`Readonly`\<[`Collection`](../interfaces/Collection.md)\<[`PersistentProperty`](../interfaces/PersistentProperty.md)[]\>\>

***

### resolveCollectionPaths

#### Set Signature

> **set** **resolveCollectionPaths**(`func`): `void`

Defined in: [store/cached-props-updater.ts:97](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/cached-props-updater.ts#L97)

##### Parameters

###### func

(`template`) => `Promise`\<`string`[]\>

##### Returns

`void`

## Methods

### updateProps()

> **updateProps**(`documentPath`, `event`): `Promise`\<`void`\>

Defined in: [store/cached-props-updater.ts:105](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/cached-props-updater.ts#L105)

#### Parameters

##### documentPath

`string`

##### event

[`DocumentChange`](../interfaces/DocumentChange.md)\<[`DocumentObject`](../type-aliases/DocumentObject.md)\>

#### Returns

`Promise`\<`void`\>
