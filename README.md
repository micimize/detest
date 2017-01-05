# Detest: Declaritive Unit Testing
*STUB* unit testing via declaritive examples in code metadata

```javascript
export const arrayify = meta`
  wraps defined non-array elements in an array,
  always returns an array.

  examples:
    ['foo'] => ['foo']
    'foo' => ['foo']
    undefined => []
    () => []
  
  tests: ${{before, after, fake}}
`(
  function arrayify(val){
    return Array.isArray(val) ? val : (val !== undefined ? [val] : [])
  }
)
```
