// usage:
//   import { assert, use } from 'chai'
//   import assertions from './assertions.js'
//   use(assertions)


import Response from '../lib/response.js'

export default function(chai, util) {
  const assert = chai.assert

  assert.noErrors = function(response) {
    assert.instanceOf(response, Response, 'is not a Response')
    assert.isFalse(response.hasErrors(), `Unexpected error(s): ${response.errorMessages()}`)
  }

  assert.matchesError = function(response, regexp) {
    assert.match(response.errorMessages(), regexp)
  }

}
