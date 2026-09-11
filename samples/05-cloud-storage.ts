import { CloudStorage, MockCloudStorage, StoredFile } from '../src'

async function main() {
  CloudStorage.useCloudStorage(new MockCloudStorage())

  const url = await CloudStorage.defaultCloudStorage.save('my-file-id', new Uint8Array([1, 2, 3]))
  console.log('Saved at:', url)

  const downloadUrl = await CloudStorage.defaultCloudStorage.getUrl('my-file-id')
  console.log('Download URL:', downloadUrl)

  const file = new StoredFile()
  file.setDataToStore(new Uint8Array([4, 5, 6]))
  await file.save()
  console.log('StoredFile URL:', file.url)
}

main()
