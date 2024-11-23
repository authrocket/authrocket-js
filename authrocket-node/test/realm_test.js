import { assert, use } from 'chai'
import assertions from './assertions.js'
use(assertions)
import h from './helper.js'
import { RecordNotFound } from '../lib/authrocket.js'


suite('Realm', ()=>{

  setup(async ()=>{
    await h.setup()
    h.client.defaultRealm = null
  })

  teardown(async ()=>{
    await h.teardown()
  })


  test('all', async ()=>{
    let res = await h.client.realms.all()
    assert.noErrors(res)
    assert(res.results.length >= 1)
    assert.equal(res.results[0].object, 'realm')
  })

  test('find', (done)=>{
    h.client.realms.find(h.realm.id)
      .then((res)=>{
        assert.noErrors(res)
        assert.equal(res.object, 'realm')
        assert.equal(res.results.object, 'realm')
        assert.isUndefined(res.made_up_field)
        done()
      }).catch(done)
  })

  test('invalid find', (done)=>{
    h.client.realms.find('rl_invalid')
      .then(()=>{ done('should have failed') })
      .catch((e)=>{
        assert.instanceOf(e, RecordNotFound)
        done()
      })
  })

  test('create', async ()=>{
    let res = await h.client.realms.create({
      name: `AR-node hello ${h.rand()}`
    })
    assert.noErrors(res)
    assert.equal(res.object, 'realm')
    assert.match(res.id, /^rl_/)
  })

  test('update', async ()=>{
    assert.notEqual(h.realm.name, 'AR-node new name')
    let res = await h.client.realms.update(h.realm.id, {
      name: 'AR-node new name'
    })
    assert.noErrors(res)
    assert.equal(res.name, 'AR-node new name')
  })

  test('delete', async ()=>{
    const id = h.realm.id
    let res = await h.client.realms.delete(id)
    assert.noErrors(res)
    h.realm = null

    try {
      await h.client.realms.find(id, {
        state: 'active'
      })
    } catch (e) {
      assert.instanceOf(e, RecordNotFound)
      return
    }
    assert.fail('find should have failed')
  })

  test('reset', async ()=>{
    h.client.defaultRealm = h.realm.id
    await h.createOrg()
    let res = await h.client.orgs.all()
    assert.noErrors(res)
    assert.equal(res.results.length, 1)

    res = await h.client.realms.reset(h.realm.id)
    assert.noErrors(res)
  })

})
