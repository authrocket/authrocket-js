// usage:
//   assert = require('chai')
//     .use(require('./assertions'))
//     .assert


const Response = require('../lib/response')

module.exports = function(chai, util) {
  const assert = chai.assert

  assert.noErrors = function(response) {
    assert.instanceOf(response, Response, 'is not a Response')
    assert.isFalse(response.hasErrors(), `Unexpected error(s): ${response.errorMessages()}`)
  }

  assert.matchesError = function(response, regexp) {
    assert.match(response.errorMessages(), regexp)
  }
  
}
