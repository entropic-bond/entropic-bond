import {
  Persistent, persistent, registerPersistentClass,
  JsonDataSource, Store, Unsubscriber
} from '../src'

@registerPersistentClass('Task')
class Task extends Persistent {
  set title(value: string | undefined) { this._title = value }
  get title(): string | undefined { return this._title }

  set done(value: boolean | undefined) { this._done = value }
  get done(): boolean | undefined { return this._done }

  @persistent private _title: string | undefined
  @persistent private _done: boolean | undefined
}

async function main() {
  const ds = new JsonDataSource()
  Store.useDataSource(ds)
  const model = Store.getModel<Task>('Task')

  const unsubscribe1: Unsubscriber = model.onDocumentChange('task-1', change => {
    console.log('Task changed:', change.type, change.after)
  })

  const unsubscribe2: Unsubscriber = model.onCollectionChange(
    model.find().where('done', '==', false),
    changes => changes.forEach(c => console.log('Collection change:', c.type))
  )

  const task = new Task()
  task.title = 'Write docs'
  task.done = false
  await model.save(task)

  unsubscribe1()
  unsubscribe2()
}

main()
