import { AuthRocketError } from './authrocket.js'
import Resource from './resource.js'
import Response from './response.js'
import { KEYUTIL, KJUR, b64utoutf8 } from 'jsrsasign'

export default class Session extends Resource {

  // reminder: expires_at and other dates are seconds, not milliseconds
  //   to convert to js date:  new Date(sess.expires_at*1000)

  constructor(client) {
    super(client)
    this.path        = 'sessions'
    this.rootElement = 'session'
  }

  async fromToken(token, params={}) {
    if (!this.client.defaultJwtKey && this.client.config.loginrocketUrl) {
      return await this.fromTokenWithDynamicKey(token, params)
    } else {
      return new Promise((resolve, reject)=>{
        resolve(this.fromTokenWithStaticKey(token, params))
      })
    }
  }

  // @private
  fromTokenWithStaticKey(token, params={}) {
    let algo = []
    let jwtKey = this.client.defaultJwtKey
    if (!jwtKey)
      throw new AuthRocketError("Missing AR jwtKey: set LOGINROCKET_URL, AUTHROCKET_JWT_KEY, or AuthRocket({loginrocketUrl: ... or jwtKey: ...})")
    jwtKey = jwtKey.trim()

    if (jwtKey.length > 256) {
      algo = ['RS256']
      if (!jwtKey.match(/^-----BEGIN /)) {
        jwtKey = `-----BEGIN PUBLIC KEY-----\n${jwtKey}\n-----END PUBLIC KEY-----`
      }
      try {
        // convert string to actual key
        jwtKey = KEYUTIL.getKey(jwtKey)
      } catch (e) {
        throw new AuthRocketError("jwtKey does not appear to be a valid RSA public key")
      }
    } else {
      algo = ['HS256']
      jwtKey = {utf8: jwtKey}
    }

    return this.verifyAndParse(token, jwtKey, algo)
  }

  // @private
  async fromTokenWithDynamicKey(token, params={}) {
    if (!token) return null
    try {
      var jwtHeader = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(token.split(".")[0]))
    } catch (e) {
      // unable to parse
      return null
    }
    if (!jwtHeader || !jwtHeader.kid) return null
    var kid = jwtHeader.kid
    var jwk
    if (jwk = this.client.loginrocket.globalJwkSet[kid]) {
      return this.verifyAndParse(token, jwk.key, [jwk.algo])
    }

    var newCerts = await this.client.loginrocket.loadJwkSet()
    if (jwk = newCerts[kid]) {
      return this.verifyAndParse(token, jwk.key, [jwk.algo])
    }
    return null
  }

  // @private
  verifyAndParse(token, jwtKey, algo) {
    // verifyJWT() doesn't handle parsing errors well, so handle it ahead of time
    try {
      var jwtHeader  = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(token.split(".")[0]))
      var jwtPayload = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(token.split(".")[1]))
    } catch (e) {
      // unable to parse
      return null
    }

    if (KJUR.jws.JWS.verifyJWT(token, jwtKey, {
      alg: algo,
      gracePeriod: 5,
      iss: ['https://authrocket.com']
    })) {
      return this.jwtToSession(jwtPayload, token)
    } else {
      return null
    }
  }

  // @private
  jwtToSession(jwt, token) {
    const user = {
      object:             'user',
      id:                 jwt['sub'],
      realm_id:           jwt['rid'],
      username:           jwt['preferred_username'] || null,
      first_name:         jwt['given_name'] || null,
      last_name:          jwt['family_name'] || null,
      name:               jwt['name'],
      email:              jwt['email'],
      email_verification: jwt['email_verified'] ? 'verified' : 'none',
      reference:          jwt['ref'],
      custom:             jwt['cs']
    }
    if (jwt['orgs']) {
      user['memberships'] = []
      jwt['orgs'].forEach((m)=>{
        user['memberships'].push({
          object:      'membership',
          id:          m['mid'],
          permissions: m['perm'] || [],
          selected:    m['selected'] || false,
          user_id:     jwt['sub'],
          org_id:      m['oid'],
          org: {
            object:    'org',
            id:        m['oid'],
            realm_id:  jwt['rid'],
            name:      m['name'],
            reference: m['ref'],
            custom:    m['cs']
          }
        })
      })
    }
    const session = {
      object:     'session',
      id:         jwt['sid'],
      created_at: jwt['iat'],
      expires_at: jwt['exp'],
      token:      token,
      user_id:    jwt['sub'],
      user:       user
    }

    return new Response(session, {}, [])
  }

}
