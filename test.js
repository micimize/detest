import 'babel-polyfill'
import 'babel-register'
import test, { runExamples } from './src/runner'
import * as examples from './src/examples'

const exampleList = Object.keys(examples).map( key => examples[key])

exampleList.forEach(runExamples)

exampleList.forEach(test)

test(examples)

test(exampleList)
