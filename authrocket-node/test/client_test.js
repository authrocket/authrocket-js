import { assert } from 'chai'
import { AuthRocket, AuthRocketError } from '../lib/authrocket.js'


suite('Client', function(){

  setup(function(){
    this.savedJwtKey = process.env.AUTHROCKET_JWT_KEY
    delete process.env.AUTHROCKET_JWT_KEY

    this.savedLoginrocketUrl = process.env.LOGINROCKET_URL
    delete process.env.LOGINROCKET_URL
  })

  teardown(function(){
    if (this.savedJwtKey === undefined)
      delete process.env.AUTHROCKET_JWT_KEY
    else
      process.env.AUTHROCKET_JWT_KEY = this.savedJwtKey

    if (this.savedLoginrocketUrl === undefined)
      delete process.env.LOGINROCKET_URL
    else
      process.env.LOGINROCKET_URL = this.savedLoginrocketUrl
  })


  test('test jwtKey', function(){
    let client = new AuthRocket()
    assert.equal(client.defaultJwtKey, undefined)

    process.env.AUTHROCKET_JWT_KEY = 'from-env'
    client = new AuthRocket()
    assert.equal(client.defaultJwtKey, 'from-env')

    client = new AuthRocket({
      jwtKey: 'from-config'
    })
    assert.equal(client.defaultJwtKey, 'from-config')

    client = new AuthRocket({
      jwtKey: null
    })
    assert.equal(client.defaultJwtKey, null)

    client = new AuthRocket({}, {skipAutoConfig: true})
    assert.equal(client.defaultJwtKey, undefined)
  })

  test('test loginrocketUrl', function(){
    let client = new AuthRocket()
    try {
      client.loginrocketUrl
      assert.fail('loginrocketUrl should have thrown an error')
    } catch (e) {
      assert.instanceOf(e, AuthRocketError)
    }

    process.env.LOGINROCKET_URL = 'http://from.env/'
    client = new AuthRocket()
    assert.equal(client.loginrocketUrl, 'http://from.env/')

    client = new AuthRocket({
      loginrocketUrl: 'http://from.config'
    })
    assert.equal(client.loginrocketUrl, 'http://from.config/')

    client = new AuthRocket({
      loginrocketUrl: null
    })
    try {
      client.loginrocketUrl
      assert.fail('loginrocketUrl should have thrown an error')
    } catch (e) {
      assert.instanceOf(e, AuthRocketError)
    }

    client = new AuthRocket({}, {skipAutoConfig: true})
    try {
      client.loginrocketUrl
      assert.fail('loginrocketUrl should have thrown an error')
    } catch (e) {
      assert.instanceOf(e, AuthRocketError)
    }
  })

})
