assert = require('chai').use(require('./assertions')).assert
h = require('./helper')
const { AuthRocketError } = require('../lib/authrocket')
const Response = require('../lib/response')


suite('Session', ()=>{

  setup(async ()=>{
    await h.setup()
    await h.createSession()
  })

  teardown(async ()=>{
    await h.teardown()
  })


  test('all', async ()=>{
    let res = await h.client.sessions.all({
      user_id: h.user.id
    })
    assert.noErrors(res)
    assert.equal(res.results.length, 1)
    assert.equal(res.results[0].object, 'session')
  })

  test('find', async ()=>{
    let res = await h.client.sessions.find(h.session.id)
    assert.noErrors(res)
    assert.equal(res.object, 'session')
  })


  test('fromToken - missing jwtKey', ()=>{
    h.client.defaultJwtKey = null
    try {
      h.client.sessions.fromToken(h.session.token)
    } catch (e) {
      assert.instanceOf(e, AuthRocketError)
      return
    }
    assert.fail('fromToken should have failed')
  })

  test('fromToken HS256', async ()=>{
    let realm = await h.client.realms.update(h.realm.id, {
      jwt_algo: 'hs256',
      jwt_scopes: 'ar.orgs'
    })
    assert.noErrors(realm)
    await h.createSession()

    h.client.defaultJwtKey = 'wrong-key'
    let res = h.client.sessions.fromToken(h.session.token)
    assert.equal(res, null)

    assert.match(realm.jwt_key, /^jsk_/)
    h.client.defaultJwtKey = realm.jwt_key
    res = h.client.sessions.fromToken('blahblah')
    assert.equal(res, null)

    res = h.client.sessions.fromToken(h.session.token)
    assert(res instanceof Response)
    assert.equal(res.object, 'session')
    assert.equal(res.user.object, 'user')
    assert.equal(res.user.memberships[0].object, 'membership')
    assert.equal(res.user.memberships[0].org.object, 'org')
  })

  test('fromToken RS256', ()=>{
    let realm = h.realm
    assert.match(realm.jwt_key, /PUBLIC KEY/)
    h.client.defaultJwtKey = realm.jwt_key
    let res = h.client.sessions.fromToken('blahblah')
    assert.equal(res, null)

    res = h.client.sessions.fromToken(h.session.token)
    assert(res instanceof Response)
    assert.equal(res.object, 'session')
    assert.equal(res.user.object, 'user')

    const shortKey = realm.jwt_key.replace(/-{5}(BEGIN|END) PUBLIC KEY-{5}/g, '').replace(/\n/g, '')
    h.client.defaultJwtKey = shortKey
    res = h.client.sessions.fromToken(h.session.token)
    assert(res instanceof Response)
    assert.equal(res.object, 'session')
    assert.equal(res.user.object, 'user')
  })


  test('create', async ()=>{
    let res = await h.client.sessions.create({
      user_id: h.user.id
    })
    assert.noErrors(res)
    assert.equal(res.object, 'session')
    assert.match(res.id, /^kss_/)
    assert(res.token)
  })

  test('delete', async ()=>{
    res = await h.client.sessions.delete(h.session.id)
    assert.noErrors(res)
  })

})
