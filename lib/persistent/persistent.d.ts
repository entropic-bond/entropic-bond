import { ClassProps } from '../types/utility-types';
export declare class Persistent {
    fromObject(obj: Partial<ClassProps<this>>): this;
    toObject(): Partial<ClassProps<this>>;
    private _persistentProperties;
}
export declare function persistent(target: Persistent, property: string): void;
export declare function persistentCollection(target: Persistent, property: string): void;
