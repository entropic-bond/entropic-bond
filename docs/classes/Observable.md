[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / Observable

# Class: Observable\<T\>

Defined in: [observable/observable.ts:19](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/observable/observable.ts#L19)

Implements the Observer pattern.
The Observable class is used to notify a list of subscribers when an event occurs.
The subscribers are callback functions that are called when the event occurs.
The event is passed as a parameter to the callback function.

## Example

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

## Type Parameters

### T

`T`

## Constructors

### Constructor

> **new Observable**\<`T`\>(): `Observable`\<`T`\>

#### Returns

`Observable`\<`T`\>

## Accessors

### subscribersCount

#### Get Signature

> **get** **subscribersCount**(): `number`

Defined in: [observable/observable.ts:62](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/observable/observable.ts#L62)

Returns the number of subscribers.

##### Example

```ts
const observable = new Observable<number>()
observable.subscribe( event => console.log( event ) )
observable.subscribe( event => console.log( event ) )
observable.subscribe( event => console.log( event ) )
console.log( observable.subscribersCount ) // 3
```

##### Returns

`number`

the number of subscribers

## Methods

### notify()

> **notify**(`event?`): `void`

Defined in: [observable/observable.ts:47](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/observable/observable.ts#L47)

Notifies all the subscribers with the event passed as parameter.

#### Parameters

##### event?

`T`

the event passed to all subscribers.

#### Returns

`void`

***

### subscribe()

> **subscribe**(`callback`): [`Unsubscriber`](../type-aliases/Unsubscriber.md)

Defined in: [observable/observable.ts:28](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/observable/observable.ts#L28)

Subscribes a listener callback function. On every notification, 
the listener callback will be called with an event as a parameter if sent.

#### Parameters

##### callback

[`Callback`](../type-aliases/Callback.md)\<`T`\>

the listener callback

#### Returns

[`Unsubscriber`](../type-aliases/Unsubscriber.md)

a function to unsubscribe the listener from further notifications

***

### unsubscribe()

> **unsubscribe**(`callback`): `void`

Defined in: [observable/observable.ts:38](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/observable/observable.ts#L38)

Removes the callback from the notification list.

#### Parameters

##### callback

[`Callback`](../type-aliases/Callback.md)\<`T`\>

the listener callback to remove

#### Returns

`void`
