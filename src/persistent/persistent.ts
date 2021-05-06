import { v4 as uuid } from "uuid"
import { SomeClassProps } from '../types/utility-types';

export type PersistentFactory = () => Persistent

interface FactoryMap {
	[id: string]: PersistentFactory
}

export class Persistent {
	static readonly factoryMap: FactoryMap = {}
	static registerFactory<T extends Persistent>(className: string, factory: () => T) {
		this.factoryMap[className] = factory
	}

	constructor() {
		this._id = uuid()
	}

	get className() {
		return this['__className'];
	}

	get id() {
		return this._id;
	}

	fromObject(obj: SomeClassProps<this>) {

		this._persistentProperties.forEach(prop => {
			const value = obj[prop.name.slice(1)]
			if (value) this[prop.name] = value
		})

		return this
	}

	toObject(): SomeClassProps<this> {
		const obj: SomeClassProps<this> = {}

		this._persistentProperties.forEach(prop => {
			const value = this[prop.name]
			obj[prop.name.slice(1)] = value
		})

		return obj
	}

	@persistent private _id: string
	private _persistentProperties: PersistentProperty[]
}

interface PersistentProperty {
	name: string
	toObjectSpecial?: (classObj: any) => any
	fromObjectSpecial?: (obj: any) => any
}

export function persistent(target: Persistent, property: string) {
	if (!target['_persistentProperties']) target['_persistentProperties'] = []
	target['_persistentProperties'].push({ name: property })
}

export function persistentCollection(target: Persistent, property: string) {
	const persistentProperty: PersistentProperty = {
		name: property,
		toObjectSpecial: (collection: any[]) => {
			collection.forEach(item => {

			})
		}
	}
}

export function registerClassFactory(className: string, factory: PersistentFactory) {
	Persistent.registerFactory(className, factory)
	return (constructor: Function) => {
		constructor.prototype.__className = className
	}
}

