import Resource from './resource.js'

export default class Invitation extends Resource {

  constructor(client) {
    super(client)
    this.path        = 'invitations'
    this.rootElement = 'invitation'
  }

  invite(id, params={}) {
    if (!id)
      return this.isBlankError()
    const path = `${this.path}/${encodeURI(id)}/invite`
    params = this.buildRoot(params)
    return this.client.post(path, params)
  }

}
