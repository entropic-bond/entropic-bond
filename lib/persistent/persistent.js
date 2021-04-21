export class Persistent {
    fromObject(obj) {
        this._persistentProperties.forEach(prop => {
            const value = obj[prop.name.slice(1)];
            if (value)
                this[prop.name] = value;
        });
        return this;
    }
    toObject() {
        const obj = {};
        this._persistentProperties.forEach(prop => {
            const value = this[prop.name];
            obj[prop.name.slice(1)] = value;
        });
        return obj;
    }
}
export function persistent(target, property) {
    if (!target['_persistentProperties'])
        target['_persistentProperties'] = [];
    target['_persistentProperties'].push({ name: property });
}
export function persistentCollection(target, property) {
    const persistentProperty = {
        name: property,
        toObjectSpecial: (collection) => {
            collection.forEach(item => {
            });
        }
    };
}
//# sourceMappingURL=persistent.js.map