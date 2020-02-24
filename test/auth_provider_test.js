assert = require('chai').use(require('./assertions')).assert
h = require('./helper')


suite('AuthProvider', ()=>{

  setup(async ()=>{
    await h.setup()
    h.authProvider = await h.client.authProviders.first()
    assert(h.authProvider)
  })

  teardown(async ()=>{
    await h.teardown()
  })


  test('all', async ()=>{
    let res = await h.client.authProviders.all()
    assert.noErrors(res)
    assert.equal(res.results.length, 2)
    assert.equal(res.results[0].object, 'auth_provider')
  })

  test('find', async ()=>{
    let res = await h.client.authProviders.find(h.authProvider.id)
    assert.noErrors(res)
    assert.equal(res.object, 'auth_provider')
  })

  test('create', async ()=>{
    let res = await h.client.authProviders.create({
      provider_type: 'google',
      client_id:     'pinky-and',
      client_secret: 'the-brain'
    })
    assert.noErrors(res)
    assert.equal(res.object, 'auth_provider')
    assert.match(res.id, /^ap_/)
  })

  test('update', async ()=>{
    assert.equal(h.authProvider.min_length, 8)
    let res = await h.client.authProviders.update(h.authProvider.id, {
      min_length: 12
    })
    assert.noErrors(res)
    assert.equal(res.min_length, 12)
  })

  test('delete', async ()=>{
    await h.createAuthProvider()
    let res = await h.client.authProviders.all()
    assert.noErrors(res)
    let count = res.results.length

    res = await h.client.authProviders.delete(h.authProvider.id)
    assert.noErrors(res)

    res = await h.client.authProviders.all()
    assert.noErrors(res)
    assert.equal(res.results.length, count-1)
  })

  test('authorizeUrls', async ()=>{
    await h.createAuthProvider()
    let res = await h.client.authProviders.authorizeUrls({
      redirect_uri: 'https://local.dev/'
    })
    assert.noErrors(res)
    assert.equal(res.results.length, 1)
    assert.equal(res.results[0].provider_type, 'facebook')
  })

  test('authorizeUrl', async ()=>{
    await h.createAuthProvider()
    let res = await h.client.authProviders.authorizeUrl(h.authProvider.id, {
      redirect_uri: 'https://local.dev/'
    })
    assert.noErrors(res)
    assert.equal(res.provider_type, 'facebook')
  })


  const testOrSkip = process.env.USE_DUMMY_AP ? test : test.skip

  testOrSkip('authorize', async ()=>{
    await h.createDummyAuthProvider()
    let res = await h.client.authProviders.authorizeUrl(h.authProvider.id, {
      redirect_uri: 'https://local.dev/'
    })

    let query = new URL(res.auth_url)
    let state = query.searchParams.get('state')
    assert(state)

    res = await h.client.authProviders.authorize({
      code:  'invalid',
      state: state
    })
    assert.match(res.errorMessages(), /Error validating code/)
    assert.match(res.metadata.retry_url, /^http/)

    res = await h.client.authProviders.authorize({
      code:  'abcdefgh',
      state: state
    })
    assert.noErrors(res)
    assert.equal(res.object, 'session')
  })

  testOrSkip('authorizeToken', async ()=>{
    await h.createDummyAuthProvider()
    let res = await h.client.authProviders.authorizeToken(h.authProvider.id, {
      access_token: 'abcdefgh'
    })
    assert.noErrors(res)
    assert.equal(res.object, 'session')
  })

})
