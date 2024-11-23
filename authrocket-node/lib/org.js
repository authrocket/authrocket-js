import Resource from './resource.js'

export default class Org extends Resource {

  constructor(client) {
    super(client)
    this.path        = 'orgs'
    this.rootElement = 'org'
  }

}
