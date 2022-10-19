import chai from 'chai'
import assert1 from '../../authrocket-node/test/assertions.js'
import assert2 from './assertions.js'
const assert = chai.use(assert1).use(assert2).assert
import ar from '../../authrocket-node/test/helper.js'
import lr from './helper.js'


suite('LoginRocket', ()=>{

  setup(async ()=>{
    await ar.setup()
    await ar.createClientApp()
    await ar.createDomain()
    await ar.createMembership()
    await lr.setup()

    let u = new URL(lr.client.lrUrl)
    u.host = ar.domain.fqdn
    lr.client.lrUrl = u.toString()
  })

  teardown(async ()=>{
    await lr.teardown()
    await ar.teardown()
  })


  test('login', async ()=>{
    let res = await lr.client.login({
      email:    ar.user.email,
      password: 'wrong'
    })
    assert.lrMatchesError(res, /Login failed/)

    res = await lr.client.login({
      email:    ar.user.email,
      password: 'quick-fox-jumped-over-the-moon'
    })
    assert.lrFullToken(res, {account: ar.org.id})
  })

  test('login w/locale', async ()=>{
    lr.client.locale = 'es'
    let res = await lr.client.login({
      email:    ar.user.email,
      password: 'wrong'
    })
    assert.lrMatchesError(res, /Error al iniciar sesión/)
  })


  test('logout', async ()=>{
    await ar.createSession()

    let res = await lr.client.logout({
      session: ar.session.id
    })
    assert.lrOkay(res)

    res = await lr.client.getSession({
      session: ar.session.id
    })
    assert.lrMatchesError(res, /Session expired/, {source: 'AccessDenied'})
  })

  test('getSession', async ()=>{
    let org1 = ar.org
    await ar.createOrg()
    await ar.createMembership()
    let org2 = ar.org
    await ar.createSession()

    let res = await lr.client.getSession({
      session: ar.session.id,
      account: org1.id
    })
    assert.lrFullToken(res, {account: org1.id})

    res = await lr.client.getSession({
      session: ar.session.id,
      account: org2.id
    })
    assert.lrFullToken(res, {account: org2.id})

    res = await lr.client.getSession({
      session: ar.session.id,
    })
    // defaults to first org when org_mode = single_user.
    // if 0 orgs, auto-creates (org_name not required) or returns must_complete_profile (org_name is required)
    assert.lrFullToken(res, {account: org1.id})

    res = await ar.client.realms.update(ar.realm.id, {
      org_mode: 'multi_user'
    })
    assert.noErrors(res)

    res = await lr.client.getSession({
      session: ar.session.id,
    })
    assert.lrSessionOnly(res, {account: null, condition: 'no_account_selected'})
  })


  test('forgotPassword', async ()=>{
    let res = await lr.client.forgotPassword({
      email: ar.user.email
    })
    assert.lrOkay(res)
  })

  test('resetPassword', async ()=>{
    let res = await ar.client.users.generatePasswordToken(ar.user.id)
    assert.noErrors(res)

    res = await lr.client.resetPassword({
      token:                 res.token,
      password:              'how-now-brown-cow!',
      password_confirmation: 'how-now-brown-cow!'
    })
    assert.lrFullToken(res, {account: ar.org.id})
  })

  test('updatePassword', async ()=>{
    await ar.createSession()

    let res = await lr.client.updatePassword()
    assert.lrMatchesError(res, /access denied/, {source: 'AccessDenied'})

    res = await lr.client.updatePassword({
      session:               ar.session.id,
      current_password:      'wrong',
      password:              'how-now-brown-cow!',
      password_confirmation: 'how-now-brown-cow!'
    })
    assert.lrMatchesError(res, /Current password does not match/)

    res = await lr.client.updatePassword({
      session:               ar.session.id,
      current_password:      'quick-fox-jumped-over-the-moon',
      password:              'how-now-brown-cow!',
      password_confirmation: 'how-now-brown-cow!'
    })
    assert.lrOkay(res)
  })


  test('updateProfile', async ()=>{
    await ar.createSession()

    let res = await lr.client.updateProfile({
      session: ar.session.id,
      email:   'george2@example.com'
    })
    assert.lrFullToken(res)
  })


  test('requestInvitation', async ()=>{
    let res = await ar.client.realms.update(ar.realm.id, {
      signup: 'invitation'
    })
    assert.noErrors(res)

    res = await lr.client.requestInvitation({
      email: 'alexander@example.com',
    })
    assert.lrOkay(res)
  })

  test('signup', async ()=>{
    let res = await ar.client.realms.update(ar.realm.id, {
      signup: 'open'
    })
    assert.noErrors(res)

    res = await lr.client.signup({
      email:    'alexander@example.com',
      password: 'how-now-brown-cow!'
    })
    assert.lrFullToken(res)
  })


  test('verifyEmail', async ()=>{
    let res = await ar.client.users.requestEmailVerification(ar.user.id)
    assert.noErrors(res)

    res = await lr.client.verifyEmail({
      token: res.token
    })
    assert.lrOkay(res)
  })

})
