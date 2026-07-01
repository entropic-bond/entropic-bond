[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / StrictElement

# Type Alias: StrictElement\<T\>

> **StrictElement**\<`T`\> = `T` *extends* `any` ? keyof `T` *extends* `never` ? `never` : `T` : `never`

Defined in: [persistent/entropic-component.ts:17](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/entropic-component.ts#L17)

Derived classes from EntropicComponent will have the ability to notify 
property changes by calling one of the provided notification methods.
It extends Persistent class therefore EntropicComponent children will have
persistence through the Entropic Bond persistence mechanism

## Type Parameters

### T

`T`
