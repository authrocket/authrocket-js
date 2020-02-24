assert = require('chai').use(require('./assertions')).assert
h = require('./helper')


suite('Invitation', ()=>{

  setup(async ()=>{
    await h.setup()
    await h.createInvitation()
  })

  teardown(async ()=>{
    await h.teardown()
  })


  test('all', async ()=>{
    let res = await h.client.invitations.all()
    assert.noErrors(res)
    assert.equal(res.results.length, 1)
    assert.equal(res.results[0].object, 'invitation')
  })

  test('first', async ()=>{
    let res = await h.client.invitations.first()
    assert.noErrors(res)
    assert.equal(res.object, 'invitation')
  })

  test('find', async ()=>{
    let res = await h.client.invitations.find(h.invitation.id)
    assert.noErrors(res)
    assert.equal(res.object, 'invitation')
  })

  test('create', async ()=>{
    let res = await h.client.invitations.create({
      email:           'freddy@example.com',
      invitation_type: 'request'
    })
    assert.noErrors(res)
    assert.equal(res.object, 'invitation')
    assert.match(res.id, /^nvt_/)
    assert(res.token)
  })

  test('update', async ()=>{
    let res = await h.client.invitations.update(h.invitation.id, {
      email: 'freddy2@example.com'
    })
    assert.noErrors(res)
  })

  test('delete', async ()=>{
    res = await h.client.invitations.delete(h.invitation.id)
    assert.noErrors(res)
  })

  test('invite', async ()=>{
    res = await h.client.invitations.invite(h.invitation.id)
    assert.noErrors(res)
  })

})
