import { camelCase, snakeCase, replaceValue, getDeepValue } from '../src'

const camel = camelCase('hello-world')
console.log('camelCase:', camel)

const snake = snakeCase('helloWorld')
console.log('snakeCase:', snake)

const template = replaceValue('Hello ${name}!', { name: 'World' })
console.log('replaceValue:', template)

const obj = { user: { profile: { name: 'Alice' } } }
const deep = getDeepValue(obj, 'user.profile.name')
console.log('getDeepValue:', deep)
