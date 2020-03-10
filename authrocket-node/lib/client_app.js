const Resource = require('./resource')

class ClientApp extends Resource {

  constructor(client) {
    super(client)
    this.path        = 'client_apps'
    this.rootElement = 'client_app'
  }

}

module.exports = ClientApp
