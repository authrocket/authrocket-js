import { assert, use } from 'chai'
import assertions from './assertions.js'
use(assertions)
import h from './helper.js'


suite('Credential', ()=>{

  setup(async ()=>{
    await h.setup()
    await h.createUser()
    h.credential = h.user.credentials[0]
    await h.activateTotpAuthProvider()
  })

  teardown(async ()=>{
    await h.teardown()
  })


  test('find', async ()=>{
    let res = await h.client.credentials.find(h.credential.id)
    assert.noErrors(res)
    assert.equal(res.object, 'credential')
  })

  test('create', async ()=>{
    let res = await h.client.credentials.create({
      user_id:          h.user.id,
      auth_provider_id: h.authProvider.id,
      credential_type:  'totp',
      name:             'Test'
    })
    assert.noErrors(res)
    assert.equal(res.object, 'credential')
    assert.match(res.id, /^crd_/)
  })

  test('update', async ()=>{
    let res = await h.client.credentials.update(h.credential.id, {
      password: '93uairgejkfdlgd'
    })
    assert.noErrors(res)
  })

  test('delete', async ()=>{
    let res = await h.client.credentials.delete(h.credential.id)
    assert.noErrors(res)
  })

  test('verify', async ()=>{
    let res = await h.client.credentials.create({
      user_id:          h.user.id,
      auth_provider_id: h.authProvider.id,
      credential_type:  'totp',
      name:             'Test'
    })
    assert.noErrors(res)
    res = await h.client.credentials.verify(res.id, {
      code: '123456'
    })
    assert.match(res.errorMessages(), /Verification failed/)
  })

})
