import meta from './meta'

export const keyValue = meta({
  description: 'transforms a { key: value } object into a { key: key, value: value }',
  examples: [{input: [{key: 'value'}], output: { key: 'key', value: 'value' }}]
})(
  function keyValue(obj){
    let key = Object.keys(obj)[0]
    return { key, value: obj[key] }
  }
)

export const flatten = meta({
  description: 'flattens an array of arrays that are nested 1 deep',
  examples: [{
    input: [ [['foo'], ['bar']] ],
    output: ['foo', 'bar']
  }]
})(
  function flatten(arrays){
    return [].concat.apply([], arrays);
  }
)


export const arrayify = meta({
  description: 'wraps defined non-array elements in an array, always returns an array',
  examples: [{
    input: [ ['foo'] ],
    output: ['foo']
  }, {
    input: [ 'foo' ],
    output: ['foo']
  }, {
    input: [ undefined ],
    output: []
  },  {
    input: [],
    output: []
  }]
})(
  function arrayify(val){
    return Array.isArray(val) ? val : (val !== undefined ? [val] : [])
  }
)


export const clone = meta({
  description: 'clone an object by reconstructing it into a copy and assigning all first-level attributes',
  examples: [{
    input: [{foo: 'foo'}],
    output: {foo: 'foo'}
  }]
})(
  function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor() || {}
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
  }
)

function objectsAreEqual(a, b) {
  // Create arrays of property names
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length != bProps.length) {
    return false;
  }

  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];

    // If values of same property are not equal,
    // objects are not equivalent
    if (a[propName] !== b[propName]) {
      return false;
    }
  }

  // If we made it this far, objects
  // are considered equivalent
  return true;
}

function values(obj){
  return Object.keys(obj).map(k => obj[k])
}

export const uniquify = meta({
  description: 'remove dups form an array by comparing the literal data structures',
  examples: [{
    input: [['foo', 'bar', 'foo']],
    output: ['foo', 'bar']
  }, {
    input: [[ {foo: 'foo'}, {bar: 'bar'}, {foo: 'foo'} ]],
    output: [{foo: 'foo'}, {bar: 'bar'}]
  }]
})(
  function uniquify(list){
    let objects = []
    list.forEach(item => {
      if((
        typeof(item) != 'object' && !objects.includes(item)
      ) || (
        !objects.filter(o => objectsAreEqual(o, item)).length)
      ){
        objects.push(item)
      }
    })
    return objects
  }
)

function mergeArrays(arrays){
  return uniquify(flatten(arrays))
}

const mergeObjects = meta({
  description: 'Merges array of objects',
  examples: [{
    input: [[ {foo: 'foo'}, {bar: 'bar'} ]],
    output: {foo: 'foo', bar: 'bar'}
  }]
})(
  function mergeObjects(objects){
    return Object.assign({}, ...objects)
  }
)

export const merge = meta({
  description: 'Merges either a spread of arrays or objects',
  examples: [{
    input: [ ['foo'], ['bar'] ],
    output: ['foo', 'bar']
  }, {
    input: [ {foo: 'foo'}, {bar: 'bar'} ],
    output: {foo: 'foo', bar: 'bar'}
  }]
})(
  function merge(...args){
    return (Array.isArray(args[0])) ? mergeArrays(args) : mergeObjects(args)
  }
)

