import {
  DataSource, Store, DocumentObject, QueryObject,
  Unsubscriber, DocumentChangeListener, CollectionChangeListener
} from '../src'

class InMemoryDataSource extends DataSource {
  private store: Map<string, Map<string, DocumentObject>> = new Map()

  override async findById(id: string, collectionName: string): Promise<DocumentObject> {
    const collection = this.store.get(collectionName)
    if (!collection) throw new Error(`Collection ${collectionName} not found`)
    const doc = collection.get(id)
    if (!doc) throw new Error(`Document ${id} not found`)
    return doc
  }

  override async find(queryObject: QueryObject<DocumentObject>, collectionName: string): Promise<DocumentObject[]> {
    const collection = this.store.get(collectionName)
    if (!collection) return []
    return Array.from(collection.values())
  }

  override async save(object: import('../src').Collections): Promise<void> {
    for (const [collectionPath, docs] of Object.entries(object)) {
      if (!docs) continue
      if (!this.store.has(collectionPath)) {
        this.store.set(collectionPath, new Map())
      }
      const collection = this.store.get(collectionPath)!
      for (const doc of docs) {
        collection.set(doc.id, doc)
      }
    }
  }

  override async delete(id: string, collectionName: string): Promise<void> {
    this.store.get(collectionName)?.delete(id)
  }

  override async next(limit?: number): Promise<DocumentObject[]> {
    return []
  }

  override async count(queryObject: QueryObject<DocumentObject>, collectionName: string): Promise<number> {
    return (await this.find(queryObject, collectionName)).length
  }

  override onCollectionChange(
    query: QueryObject<DocumentObject>, collectionName: string,
    listener: CollectionChangeListener<DocumentObject>
  ): Unsubscriber {
    return () => {}
  }

  override onDocumentChange(
    documentPath: string, documentId: string,
    listener: DocumentChangeListener<DocumentObject>
  ): Unsubscriber {
    return () => {}
  }

  override onDocumentTemplateChange(
    collectionTemplate: string,
    listener: DocumentChangeListener<DocumentObject>
  ): Unsubscriber {
    return () => {}
  }

  protected override resolveCollectionPaths(template: string): Promise<string[]> {
    return Promise.resolve([])
  }
}

async function main() {
  Store.useDataSource(new InMemoryDataSource())
  console.log('Custom DataSource registered successfully')
}

main()
