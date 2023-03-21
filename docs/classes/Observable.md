[entropic-bond](../README.md) / [Exports](../modules.md) / Observable

# Class: Observable<T\>

Implements the Observer pattern.
The Observable class is used to notify a list of subscribers when an event occurs.
The subscribers are callback functions that are called when the event occurs.
The event is passed as a parameter to the callback function.

**`Example`**

```ts
// Create an observable
const observable = new Observable<number>()
// Subscribe a listener
const unsubscribe = observable.subscribe( event => console.log( event ) )
// Notify the subscribers
observable.notify( 1 )
// Unsubscribe the listener
unsubscribe()
```

## Type parameters

| Name |
| :------ |
| `T` |

## Table of contents

### Constructors

- [constructor](Observable.md#constructor)

### Methods

- [notify](Observable.md#notify)
- [subscribe](Observable.md#subscribe)
- [unsubscribe](Observable.md#unsubscribe)

## Constructors

### constructor

• **new Observable**<`T`\>()

#### Type parameters

| Name |
| :------ |
| `T` |

## Methods

### notify

▸ **notify**(`event?`): `void`

Notifies all the subscribers with the event passed as parameter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event?` | `T` | the event passed to all subscribers. |

#### Returns

`void`

#### Defined in

[observable/observable.ts:47](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/observable/observable.ts#L47)

___

### subscribe

▸ **subscribe**(`callback`): [`Unsubscriber`](../modules.md#unsubscriber)

Subscribes a listener callback function. On every notification, 
the listener callback will be called with an event as a parameter if sent.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | [`Callback`](../modules.md#callback)<`T`\> | the listener callback |

#### Returns

[`Unsubscriber`](../modules.md#unsubscriber)

a function to unsubscribe the listener from further notifications

#### Defined in

[observable/observable.ts:28](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/observable/observable.ts#L28)

___

### unsubscribe

▸ **unsubscribe**(`callback`): `void`

Removes the callback from the notification list.

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`Callback`](../modules.md#callback)<`T`\> |

#### Returns

`void`

#### Defined in

[observable/observable.ts:38](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/observable/observable.ts#L38)
