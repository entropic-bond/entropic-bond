export declare type Callback<T> = (event: T) => void;
export declare class Observable<T> {
    subscribe(callback: Callback<T>): void;
    unsubscribe(callback: Callback<T>): void;
    notify(event?: T): void;
    private subscribers;
}
