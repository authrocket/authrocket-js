import { assert, use } from 'chai'
import assertions from './assertions.js'
use(assertions)
import h from './helper.js'
import { AuthRocket, RecordNotFound } from '../lib/authrocket.js'
import Resource from '../lib/resource.js'


suite('Resource', ()=>{

  setup(()=>{
    h.client = new AuthRocket()
  })


  test('null find', (done)=>{
    let r = new Resource(h.client)
    const promise = r.find(null)
      .then(()=>{ done('should have failed') })
      .catch((e)=>{
        assert.instanceOf(e, RecordNotFound)
        done()
      })
    assert.instanceOf(promise, Promise)
  })

  test('null update', (done)=>{
    let r = new Resource(h.client)
    const promise = r.update(null)
      .then(()=>{ done('should have failed') })
      .catch((e)=>{
        assert.instanceOf(e, RecordNotFound)
        done()
      })
    assert.instanceOf(promise, Promise)
  })

  test('null delete', (done)=>{
    let r = new Resource(h.client)
    const promise = r.delete(null)
      .then(()=>{ done('should have failed') })
      .catch((e)=>{
        assert.instanceOf(e, RecordNotFound)
        done()
      })
    assert.instanceOf(promise, Promise)
  })

})
