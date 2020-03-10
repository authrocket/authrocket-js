const Resource = require('./resource')

class Org extends Resource {

  constructor(client) {
    super(client)
    this.path        = 'orgs'
    this.rootElement = 'org'
  }

}

module.exports = Org
