import { RecordNotFound } from './authrocket.js'
import Response from './response.js'

export default class Resource {

  constructor(client) {
    this.client = client
    this.path = 'not-set'
    this.rootElement = 'not-set'
  }


  all(params={}) {
    return this.client.get(this.path, params)
  }

  first(params={}) {
    params = Object.assign({}, params, {max_results: 1})
    return this.all(params).then(res=>{
      if (res.results.length == 0) {
        return null
      } else {
        return new Response(res.results[0], res.metadata, res.errors)
      }
    })
  }

  find(id, params={}) {
    if (!id)
      return this.isBlankError()
    const path = `${this.path}/${encodeURI(id)}`
    return this.client.get(path, params)
  }

  create(params={}) {
    params = this.buildRoot(params)
    return this.client.post(this.path, params)
  }

  update(id, params={}) {
    if (!id)
      return this.isBlankError()
    const path = `${this.path}/${encodeURI(id)}`
    params = this.buildRoot(params)
    return this.client.put(path, params)
  }

  delete(id, params={}) {
    if (!id)
      return this.isBlankError()
    const path = `${this.path}/${encodeURI(id)}`
    return this.client.delete(path, params)
  }


  // @protected
  buildRoot(params) {
    if (!params[this.rootElement]) {
      if (params.request) {
        params = Object.assign({}, params)
        const req = params.request
        delete params.request
        params = {
          [this.rootElement]: params,
          request: req
        }
      } else {
        params = {
          [this.rootElement]: params,
        }
      }
    }
    return params
  }


  // @private
  errorPromise(klass, message) {
    return new Promise((resolve, reject)=>{
      reject(new klass(message))
    })
  }

  // @private
  isBlankError() {
    return this.errorPromise(RecordNotFound, 'id is blank')
  }

}
