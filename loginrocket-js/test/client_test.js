import { assert } from 'chai'
import { LoginRocket, LoginRocketError } from '../lib/loginrocket.js'


suite('Client', function(){

  test('test lrUrl', function(){
    let client = new LoginRocket()
    try {
      client.lrUrl
      assert.fail('lrUrl should have thrown an error')
    } catch (e) {
      assert.instanceOf(e, LoginRocketError)
    }

    client = new LoginRocket({
      url: 'http://from.config'
    })
    assert.equal(client.lrUrl, 'http://from.config/v2/')

    client = new LoginRocket({
      url: 'http://from.config/v2'
    })
    assert.equal(client.lrUrl, 'http://from.config/v2/')

    client = new LoginRocket({
      url: null
    })
    try {
      client.lrUrl
      assert.fail('lrUrl should have thrown an error')
    } catch (e) {
      assert.instanceOf(e, LoginRocketError)
    }
  })

  test('test locale', function(){
    let client = new LoginRocket()
    assert.equal(undefined, client.locale)

    client = new LoginRocket({
      locale: 'es'
    })
    assert.equal('es', client.locale)

    client.locale = 'en'
    assert.equal('en', client.locale)

    client.locale = ''
    assert.equal(undefined, client.locale)

    client.locale = null
    assert.equal(undefined, client.locale)
  })

})
