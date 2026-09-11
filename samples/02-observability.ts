import { EntropicComponent, Observable, Unsubscriber } from '../src'

class Counter extends EntropicComponent {
  private _value: number = 0

  get value(): number { return this._value }
  set value(v: number) { this.changeProp('value', v) }

  increment(): void { this.value = this._value + 1 }
}

const counter = new Counter()
const unsubscribe: Unsubscriber = counter.onChange(event => {
  console.log('Counter changed:', event)
})

counter.increment()
counter.increment()
unsubscribe()

// Standalone Observable
const bus = new Observable<string>()
const unsubscribeBus = bus.subscribe(msg => console.log('Received:', msg))
bus.notify('hello')
bus.notify('world')
unsubscribeBus()
