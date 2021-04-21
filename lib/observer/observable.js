export class Observable {
    constructor() {
        this.subscribers = [];
    }
    subscribe(callback) {
        this.subscribers.push(callback);
    }
    unsubscribe(callback) {
        this.subscribers = this.subscribers.filter(cb => cb !== callback);
    }
    notify(event) {
        this.subscribers.forEach(subs => subs(event));
    }
}
//# sourceMappingURL=observable.js.map