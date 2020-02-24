const Resource = require('./resource')

class Realm extends Resource {

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

module.exports = Realm
