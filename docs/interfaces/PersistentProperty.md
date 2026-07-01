[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / PersistentProperty

# Interface: PersistentProperty

Defined in: [persistent/persistent.ts:566](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L566)

## Properties

### cachedProps?

> `optional` **cachedProps?**: [`ClassPropNamesOfType`](../type-aliases/ClassPropNamesOfType.md)\<[`Persistent`](../classes/Persistent.md), [`Primitive`](../type-aliases/Primitive.md)\>[]

Defined in: [persistent/persistent.ts:578](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L578)

***

### fromObjectSpecial?

> `optional` **fromObjectSpecial?**: (`obj`) => `any`

Defined in: [persistent/persistent.ts:573](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L573)

#### Parameters

##### obj

`any`

#### Returns

`any`

***

### isPureReference?

> `optional` **isPureReference?**: `boolean`

Defined in: [persistent/persistent.ts:569](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L569)

***

### isReference?

> `optional` **isReference?**: `boolean`

Defined in: [persistent/persistent.ts:568](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L568)

***

### name

> **name**: `string`

Defined in: [persistent/persistent.ts:567](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L567)

***

### ownerClassName

> **ownerClassName**: () => `string`

Defined in: [persistent/persistent.ts:577](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L577)

#### Returns

`string`

***

### ownerCollection?

> `optional` **ownerCollection?**: `string` \| [`CollectionPathCallback`](../type-aliases/CollectionPathCallback.md)

Defined in: [persistent/persistent.ts:571](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L571)

***

### searchableArray?

> `optional` **searchableArray?**: `boolean`

Defined in: [persistent/persistent.ts:574](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L574)

***

### storeInCollection?

> `optional` **storeInCollection?**: `string` \| [`CollectionPathCallback`](../type-aliases/CollectionPathCallback.md)

Defined in: [persistent/persistent.ts:570](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L570)

***

### toObjectSpecial?

> `optional` **toObjectSpecial?**: (`classObj`) => `any`

Defined in: [persistent/persistent.ts:572](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L572)

#### Parameters

##### classObj

`any`

#### Returns

`any`

***

### typeName?

> `optional` **typeName?**: `string` \| `string`[]

Defined in: [persistent/persistent.ts:576](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L576)

***

### validator?

> `optional` **validator?**: [`ValidatorFunction`](../type-aliases/ValidatorFunction.md)\<`any`, `any`\>

Defined in: [persistent/persistent.ts:575](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L575)
