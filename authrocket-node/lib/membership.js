import Resource from './resource.js'

export default class Membership extends Resource {

  constructor(client) {
    super(client)
    this.path        = 'memberships'
    this.rootElement = 'membership'
  }

}
