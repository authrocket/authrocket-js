assert = require('chai').use(require('./assertions')).assert
h = require('./helper')
const { AuthRocket, RecordNotFound } = require('../lib/authrocket')
const Resource = require('../lib/resource')


suite('Resource', ()=>{

  setup(()=>{
    h.client = new AuthRocket()
  })


  test('null find', (done)=>{
    r = new Resource(h.client)
    const promise = r.find(null)
      .then(()=>{ done('should have failed') })
      .catch((e)=>{
        assert.instanceOf(e, RecordNotFound)
        done()
      })
    assert.instanceOf(promise, Promise)
  })

  test('null update', (done)=>{
    r = new Resource(h.client)
    const promise = r.update(null)
      .then(()=>{ done('should have failed') })
      .catch((e)=>{
        assert.instanceOf(e, RecordNotFound)
        done()
      })
    assert.instanceOf(promise, Promise)
  })

  test('null delete', (done)=>{
    r = new Resource(h.client)
    const promise = r.delete(null)
      .then(()=>{ done('should have failed') })
      .catch((e)=>{
        assert.instanceOf(e, RecordNotFound)
        done()
      })
    assert.instanceOf(promise, Promise)
  })

})
