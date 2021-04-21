export declare type ClassMethodNames<T> = {
    [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
export declare type ClassMethods<T> = Pick<T, ClassMethodNames<T>>;
export declare type ClassPropNames<T> = {
    [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
export declare type ClassProps<T> = Pick<T, ClassPropNames<T>>;
