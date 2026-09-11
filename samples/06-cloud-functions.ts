import { CloudFunctions, CloudFunctionsMock, FunctionCollection } from '../src'

async function main() {
  const functions: FunctionCollection = {
    greet: async (params: { name: string }) => `Hello, ${params.name}!`,
    add: async (params: { a: number; b: number }) => params.a + params.b,
  }

  CloudFunctions.useCloudFunctionsService(new CloudFunctionsMock(functions))

  const greetFn = CloudFunctions.instance.getFunction<{ name: string }, string>('greet')
  const greeting = await greetFn({ name: 'World' })
  console.log(greeting)

  const addFn = CloudFunctions.instance.getFunction<{ a: number; b: number }, number>('add')
  const sum = await addFn({ a: 3, b: 4 })
  console.log('3 + 4 =', sum)
}

main()
