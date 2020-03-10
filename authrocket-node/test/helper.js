assert = require('chai').use(require('./assertions')).assert
const { AuthRocket } = require('../lib/authrocket')

class Helper {

  constructor(context) {
    this.reset()
  }

  reset() {
    this.resources = {}
  }

  get authProvider(){ return this.resources['authProvider'] }
  get clientApp(){ return this.resources['clientApp'] }
  get domain(){ return this.resources['domain'] }
  get invitation(){ return this.resources['invitation'] }
  get membership(){ return this.resources['membership'] }
  get org(){ return this.resources['org'] }
  get realm(){ return this.resources['realm'] }
  get session(){ return this.resources['session'] }
  get user(){ return this.resources['user'] }

  set authProvider(v){ this.resources['authProvider'] = v }
  set clientApp(v){ this.resources['clientApp'] = v }
  set domain(v){ this.resources['domain'] = v }
  set invitation(v){ this.resources['invitation'] = v }
  set membership(v){ this.resources['membership'] = v }
  set org(v){ this.resources['org'] = v }
  set realm(v){ this.resources['realm'] = v }
  set session(v){ this.resources['session'] = v }
  set user(v){ this.resources['user'] = v }


  async setup() {
    this.client = new AuthRocket()
    await this.createRealm()
    this.client.defaultRealm = this.realm.id
  }

  async teardown() {
    await this.deleteRealm()
    this.client = null
  }


  rand() {
    return Math.floor(Math.random()*100000)
  }


  async createAuthProvider() {
    const res = this.authProvider = await this.client.authProviders.create({
      provider_type: 'facebook',
      client_id:     'dummy-1',
      client_secret: 'dummy-2'
    })
    assert.noErrors(res)
    assert.equal(res.object, 'auth_provider')
  }

  async createDummyAuthProvider() {
    const res = this.authProvider = await this.client.authProviders.create({
      provider_type: process.env.USE_DUMMY_AP,
      client_id:     'dummy-1',
      client_secret: 'dummy-2'
    })
    assert.noErrors(res)
    assert.equal(res.object, 'auth_provider')
  }

  async activateTotpAuthProvider() {
    let res = await this.client.authProviders.find('totp', {
      realm_id: this.realm.id
    })
    res = this.authProvider = await this.client.authProviders.update(res.id, {
      state: 'active'
    })
    assert.noErrors(res)
    assert.equal(res.object, 'auth_provider')
  }


  async createClientApp() {
    const res = this.clientApp = await this.client.clientApps.create({
      client_type: 'standard',
      name: 'ar-node-sdk',
      redirect_uris: ['http://localhost:3000/']
    })
    assert.noErrors(res)
    assert.equal(res.object, 'client_app')
  }


  async createDomain() {
    const res = this.domain = await this.client.domains.create({
      domain_type: 'loginrocket'
    })
    assert.noErrors(res)
    assert.equal(res.object, 'domain')
  }


  async createInvitation() {
    const em = `invitee-${this.rand()}@example.com`
    const res = this.invitation = await this.client.invitations.create({
      email:           em,
      invitation_type: 'request'
    })
    assert.noErrors(res)
    assert.equal(res.object, 'invitation')
  }


  async createMembership() {
    if (!this.user)
      await this.createUser()
    if (!this.org)
      await this.createOrg()
    const res = this.membership = await this.client.memberships.create({
      user_id: this.user.id,
      org_id:  this.org.id
    })
    assert.noErrors(res)
    assert.equal(res.object, 'membership')
  }


  async createOrg() {
    const res = this.org = await this.client.orgs.create({
      name: 'default1'
    })
    assert.noErrors(res)
    assert.equal(res.object, 'org')
  }


  async createRealm() {
    if (this.realm)
      return
    const res = this.realm = await this.client.realms.create({
      name: `AR-node ${Date.now()}-${this.rand()}`
    })
    assert.noErrors(res)
    assert.match(res.id, /^rl_/, 'createRealm() did not return a valid realm ID')
    assert.equal(res.object, 'realm')
  }

  async deleteRealm() {
    if (this.realm) {
      const res = await this.client.realms.delete(this.realm.id)
      assert.noErrors(res)
    }
    this.reset()
  }

  async deleteStaleRealms() {
    if (!this.client)
      this.client = new AuthRocket()
    const res = await this.client.realms.all()
    res.results.forEach(async (r)=>{
      if (r.name.match(/^AR-node /)) {
        const res2 = await this.client.realms.delete(r.id)
        assert.noErrors(res2, `Realm ${r.id} (${r.name})`)
      }
    })
  }


  async createSession() {
    if (!this.membership)
      await this.createMembership()
    const res = this.session = await this.client.sessions.create({
      user_id: this.user.id
    })
    assert.noErrors(res)
    assert.equal(res.object, 'session')
  }


  async createUser() {
    const em = `user-${this.rand()}@example.com`
    const res = this.user = await this.client.users.create({
      email:      em,
      password:   'quick-fox-jumped-over-the-moon',
      first_name: 'george'
    })
    assert.noErrors(res)
    assert.equal(res.object, 'user')
  }

}

module.exports = new Helper()
