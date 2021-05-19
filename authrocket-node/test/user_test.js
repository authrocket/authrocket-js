assert = require('chai').use(require('./assertions')).assert
h = require('./helper')


suite('User', ()=>{

  setup(async ()=>{
    await h.setup()
    await h.createUser()
  })

  teardown(async ()=>{
    await h.teardown()
  })


  test('all', async ()=>{
    let res = await h.client.users.all()
    assert.noErrors(res)
    assert.equal(res.results.length, 1)
    assert.equal(res.results[0].object, 'user')
  })

  test('find', async ()=>{
    let res = await h.client.users.find(h.user.email)
    assert.noErrors(res)
    assert.equal(res.object, 'user')
  })

  test('create', async ()=>{
    let res = await h.client.users.create({
      email:    'alexander@example.com',
      password: 'how-now-brown-cow!'
    })
    assert.noErrors(res)
    assert.equal(res.object, 'user')
    assert.match(res.id, /^usr_/)
  })

  test('update', async ()=>{
    assert.equal(h.user.first_name, 'george')
    let res = await h.client.users.update(h.user.id, {
      first_name: 'freddy'
    })
    assert.noErrors(res)
    assert.equal(res.first_name, 'freddy')
  })

  test('update password', async ()=>{
    let res = await h.client.users.updatePassword(h.user.id, {
      current_password:      'wrong',
      password:              'how-now-brown-cow!',
      password_confirmation: 'how-now-brown-cow!'
    })
    assert.match(res.errorMessages(), /Current password does not match/)

    res = await h.client.users.updatePassword(h.user.id, {
      current_password:      'quick-fox-jumped-over-the-moon',
      password:              'how-now-brown-cow!',
      password_confirmation: 'how-now-brown-cow!'
    })
    assert.noErrors(res)
  })

  test('update profile', async ()=>{
    let res = await h.client.users.updateProfile(h.user.id, {
      email: 'george2@example.com'
    })
    assert.noErrors(res)
  })

  test('delete', async ()=>{
    res = await h.client.users.delete(h.user.id)
    assert.noErrors(res)

    res = await h.client.users.all()
    assert.noErrors(res)
    assert.equal(res.results.length, 0)
  })

  test('authenticate', async ()=>{
    let res = await h.client.users.authenticate(h.user.id, {
      password: 'wrong'
    })
    assert.match(res.errorMessages(), /Login failed/)

    res = await h.client.users.authenticate(h.user.id, {
      password: 'quick-fox-jumped-over-the-moon'
    })
    assert.noErrors(res)
    assert.equal(res.object, 'session')
    assert(res.token)
  })

  test('authenticate w/locale', async ()=>{
    h.client.locale = 'es'
    let res = await h.client.users.authenticate(h.user.id, {
      password: 'wrong'
    })
    assert.match(res.errorMessages(), /Error al iniciar sesión/)

    h.client.locale = null
    res = await h.client.users.authenticate(h.user.id, {
      password: 'wrong'
    })
    assert.match(res.errorMessages(), /Login failed/)
  })

  test('request email verification', async ()=>{
    let res = await h.client.users.requestEmailVerification(h.user.id)
    assert.noErrors(res)
    assert.equal(res.object, 'token')
    assert.match(res.token, /^tve:/)
  })

  test('verify email', async ()=>{
    let res = await h.client.users.requestEmailVerification(h.user.id)
    assert.noErrors(res)

    res = await h.client.users.verifyEmail({
      token: res.token
    })
    assert.noErrors(res)
    assert.equal(res.object, 'user')
  })

  test('generate password token', async ()=>{
    let res = await h.client.users.generatePasswordToken(h.user.id)
    assert.noErrors(res)
    assert.equal(res.object, 'token')
    assert.match(res.token, /^tpw:/)
  })

  test('reset password with token', async ()=>{
    let res = await h.client.users.generatePasswordToken(h.user.id)
    assert.noErrors(res)

    res = await h.client.users.resetPasswordWithToken({
      token:                 res.token,
      password:              'how-now-brown-cow!',
      password_confirmation: 'how-now-brown-cow!'
    })
    assert.noErrors(res)
    assert.equal(res.object, 'session')
  })

  test('accept invitation', async ()=>{
    await h.createOrg()
    let invite = await h.client.invitations.create({
      email:           'freddy@example.com',
      invitation_type: 'org',
      org_id:          h.org.id
    })
    assert.noErrors(invite)

    let res = await h.client.users.acceptInvitation(h.user.id, {
      token: invite.token
    })
    assert.noErrors(res)
  })

})
