import Resource from './resource.js'

export default class Domain extends Resource {

  constructor(client) {
    super(client)
    this.path        = 'domains'
    this.rootElement = 'domain'
  }

}
