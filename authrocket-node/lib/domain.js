const Resource = require('./resource')

class Domain extends Resource {

  constructor(client) {
    super(client)
    this.path        = 'domains'
    this.rootElement = 'domain'
  }

}

module.exports = Domain
