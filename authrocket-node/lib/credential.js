import Resource from './resource.js'

export default class Credential extends Resource {

  constructor(client) {
    super(client)
    this.path        = 'credentials'
    this.rootElement = 'credential'
  }

  // params = {
  //   code: '123456'
  // }
  verify(id, params={}) {
    if (!id)
      return this.isBlankError()
    const path = `${this.path}/${encodeURI(id)}/verify`
    params = this.buildRoot(params)
    return this.client.post(path, params)
  }

}
