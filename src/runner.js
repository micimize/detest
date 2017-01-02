import unitTest from 'ava'
import meta from './meta'
import * as examples from './examples'
import newMultiMethod from './multimethod'

const arrayify = examples.arrayify

const exampleList = Object.keys(examples).map(key => examples[key])

const defaults = f => ({
  description: `nondescript function ${f.name}`
})

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
        examples.forEach(({input, output}) => {
          if(typeof output == 'object'){
            t.deepEqual(f(...arrayify(input)), output);
          } else {
            t.is(f(...arrayify(input)), output);
          }
        })
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
