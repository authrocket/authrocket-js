const Resource = require('./resource')

class Membership extends Resource {

  constructor(client) {
    super(client)
    this.path        = 'memberships'
    this.rootElement = 'membership'
  }

}

module.exports = Membership
