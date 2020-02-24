assert = require('chai').assert
const { AuthRocket } = require('../lib/authrocket')


suite('Client', function(){

  setup(function(){
    this.savedJwtKey = process.env.AUTHROCKET_JWT_KEY
    delete process.env.AUTHROCKET_JWT_KEY
  })

  teardown(function(){
    if (this.savedJwtKey) {
      process.env.AUTHROCKET_JWT_KEY = this.savedJwtKey
    }
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

})
