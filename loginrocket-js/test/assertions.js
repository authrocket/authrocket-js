// usage:
//   import { assert, use } from 'chai'
//   import a1 from './assertions.js'
//   use(a1)


export default function(chai, util) {
  const assert = chai.assert

  assert.lrFullToken = function(response, args={}) {
    assert.equal(response.result, 'full_login', `Full response: ${JSON.stringify(response)}`)
    assert.match(response.session, /^kss_/)
    if ('account' in args)
      assert.equal(response.account, args.account)
    else
      assert.match(response.account, /^org_/)
    assert(response.token)
  }

  assert.lrSessionOnly = function(response, args={}) {
    assert.equal(response.result, 'conditional_login', `Full response: ${JSON.stringify(response)}`)
    assert.match(response.session, /^kss_/)
    if ('account' in args)
      assert.equal(response.account, args.account)
    else
      assert.match(response.account, /^org_/)
    if (args.condition)
      assert.include(response.conditions, args.condition)
    assert.notExists(response.token)
  }

  assert.lrOkay = function(response) {
    assert.equal(response.result, 'okay', `Full response: ${JSON.stringify(response)}`)
    assert.notExists(response.token)
  }

  assert.lrMatchesError = function(response, regexp, args={}) {
    assert.equal(response.result, 'error')
    assert.match(response.error, regexp)
    assert.match(response.errors, regexp)
    if (args.source)
      assert.equal(response.source, args.source)
    else
      assert.notExists(response.source)
  }

}
