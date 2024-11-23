import { assert, use } from 'chai'
import assertions from './assertions.js'
use(assertions)
import h from './helper.js'


suite('Membership', ()=>{

  setup(async ()=>{
    await h.setup()
    await h.createMembership()
  })

  teardown(async ()=>{
    await h.teardown()
  })


  test('all', async ()=>{
    let res = await h.client.memberships.all({
      org_id: h.org.id
    })
    assert.noErrors(res)
    assert.equal(res.results.length, 1)
    assert.equal(res.results[0].object, 'membership')
  })

  test('find', async ()=>{
    let res = await h.client.memberships.find(h.membership.id)
    assert.noErrors(res)
    assert.equal(res.object, 'membership')
  })

  test('create', async ()=>{
    let res = await h.client.memberships.delete(h.membership.id)
    assert.noErrors(res)

    res = await h.client.memberships.create({
      org_id:  h.org.id,
      user_id: h.user.id
    })
    assert.noErrors(res)
    assert.equal(res.object, 'membership')
    assert.match(res.id, /^mb_/)
  })

  test('update', async ()=>{
    assert.deepEqual(h.membership.permissions, [])
    let res = await h.client.memberships.update(h.membership.id, {
      permissions: ['one', 'two']
    })
    assert.noErrors(res)
    assert.deepEqual(res.permissions, ['one', 'two'])
  })

  test('delete', async ()=>{
    let res = await h.client.memberships.delete(h.membership.id)
    assert.noErrors(res)
  })

})
