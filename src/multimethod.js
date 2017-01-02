import meta from './meta'

const builtinChecks = {
  'object':    value => (typeof value == 'object'),
  'array':     value => (Array.isArray(value)),
  'function':  value => (typeof value == 'function'),
  'null':      value => value === null,
  'undefined': value => value === undefined,
  'falsy':     value => !value,
  'truthy':    value => value,
  'default':   value => true,
}

const builtinOrder = ['null', 'undefined', 'falsy', 'function', 'array', 'object', 'truthy', 'default']

export default meta({
  description: "applies the function matching the given value's type",
  examples: [{
    input: { object: Object.keys }, 
    outputFunction: {
      output: Object.keys,
      examples: [{input: {foo: 'bar'}, output: ['foo']}]
    }
  }]
})(
  function newMultiMethod(switches = {}, {
    apply = true,
    checks: userChecks = {},
    order: userOrder,
    defaultChecks = builtinChecks,
    defaultOrder = builtinOrder
  } = {}){
    const checks = Object.assign(defaultChecks, userChecks)
    const order = [
      ...(userOrder || Object.keys(userChecks).filter(c => defaultOrder.includes(c))),
      ...defaultOrder
    ]
    const switchKeys = Object.keys(switches)
    const orderedSwitchKeys = order.filter(key => switchKeys.includes(key))
    if(apply){
      return function multiMethod(value){
        for (let key of orderedSwitchKeys){
          if(checks[key](value)){
            return switches[key](value)
          }
        }
      }
    } else {
      return function multiMethod(value){
        for (let key of orderedSwitchKeys){
          if(checks[key](value)){
            return switches[key]
          }
        }
      }
    }
  }
)
