assert = require('chai').use(require('./assertions')).assert
h = require('./helper')


suite('Org', ()=>{

  setup(async ()=>{
    await h.setup()
    await h.createOrg()
  })

  teardown(async ()=>{
    await h.teardown()
  })


  test('all', async ()=>{
    let res = await h.client.orgs.all()
    assert.noErrors(res)
    assert.equal(res.results.length, 1)
    assert.equal(res.results[0].object, 'org')
  })

  test('find', async ()=>{
    let res = await h.client.orgs.find(h.org.id)
    assert.noErrors(res)
    assert.equal(res.object, 'org')
  })

  test('create', async ()=>{
    let res = await h.client.orgs.create({
      name: 'hello'
    })
    assert.noErrors(res)
    assert.equal(res.object, 'org')
    assert.match(res.id, /^org_/)
  })

  test('update', async ()=>{
    assert.equal(h.org.name, 'default1')
    let res = await h.client.orgs.update(h.org.id, {
      name: 'new name'
    })
    assert.noErrors(res)
    assert.equal(res.name, 'new name')
  })

  test('delete - close', async ()=>{
    res = await h.client.orgs.delete(h.org.id)
    assert.noErrors(res)
    assert.equal(res.state, 'closed')
  })

  test('delete - delete', async ()=>{
    res = await h.client.orgs.delete(h.org.id, {
      force: true
    })
    assert.noErrors(res)

    res = await h.client.orgs.all()
    assert.noErrors(res)
    assert.equal(res.results.length, 0)
  })

})
