import tap from 'tap'
import ava from 'ava'
import meta from './meta'
import * as examples from './examples'
import newMultiMethod from './multimethod'

const runners = {
  tap: tap.test,
  ava
}
const unitTest = runners[process.env.RUNNER || 'ava']

const arrayify = examples.arrayify

const exampleList = Object.keys(examples).map(key => examples[key])

const defaults = f => ({
  description: `nondescript function ${f.name}`
})

function multiTest(t, f, {input, output, description}){
  if(typeof output == 'object'){
    t.deepEqual(f(...arrayify(input)), output, description);
  } else {
    t.is(f(...arrayify(input)), output, description);
  }
}

export const runExamples = meta({
  description: `Runs examples from the given function's metadata of the format [{ input, output }],
                comparing them with deepEqual`,
  examples: exampleList.map(input => ({ input }))
})(
  function runExamples(f){
    let { description, examples = [] } = meta.get(f) || defaults(f)
    if(!examples.length){
      unitTest.todo(`add examples to ${f.name} (${description})`)
    } else {
      unitTest(description, t => {
        t.plan(examples.length)
        examples.forEach(example => multiTest(t, f, example))
      })
    }
  }
)

const runTests = newMultiMethod({
  falsy(unit){ return },
  function: runExamples,
  array(unit){
    Object.keys(unit).forEach(runTests)
  },
  object(unit){
    Object.keys(unit).forEach(key => runTests(unit[key]))
  },
})

export default meta({
  description: "Run all examples from a given module",
  examples: [{ input: examples }, { input: exampleList }]
})( runTests )
