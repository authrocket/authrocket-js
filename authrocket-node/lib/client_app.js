import Resource from './resource.js'

export default class ClientApp extends Resource {

  constructor(client) {
    super(client)
    this.path        = 'client_apps'
    this.rootElement = 'client_app'
  }

}
