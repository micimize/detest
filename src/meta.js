export const META = Symbol('meta')

function meta(data){
  return object => {
    object[META] = data
    return object
  }
}

export const get = meta({
  description: "Get metadata from the given object",
  examples: [{ input: {[META]: 'metadata'}, output: 'metadata'}]
})(
  function get(obj){
    return obj[META]
  }
)

meta.get = get

export default meta({
  description: "Add meta data to an object under the symbol exported by this module as META"
})(meta)
