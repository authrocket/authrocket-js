import Resource from './resource.js'

export default class Realm extends Resource {

  constructor(client) {
    super(client)
    this.path        = 'realms'
    this.rootElement = 'realm'
  }

  reset(id, params={}) {
    if (!id)
      return this.isBlankError()
    const path = `${this.path}/${encodeURI(id)}/reset`
    return this.client.post(path, params)
  }

}
