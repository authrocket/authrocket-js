import axios from 'axios'
import Resource from './resource.js'
import Response from './response.js'
import { KEYUTIL } from 'jsrsasign'

export default class LoginRocket extends Resource {

  // @private
  loadJwkSet() {
    let uri = this.client.loginrocketUrl
    uri.pathname = '/connect/jwks'

    return axios.request({
      timeout: 8000,
      headers: {
        'Accept-Encoding': 'gzip, deflate',
        'User-Agent': `AuthRocket/node v${this.client.VERSION}`
      },
      validateStatus: this.client.checkStatus,
      method: 'get',
      url: uri.href,
    })
    .then(Response.parseResponse)
    .then((resp)=>{
      let certs = {}
      resp.keys.forEach((h)=>{
        let crt = `-----BEGIN PUBLIC KEY-----\n${h.x5c[0]}\n-----END PUBLIC KEY-----`
        certs[h.kid] = {key: KEYUTIL.getKey(crt), algo: h.alg}
      })
      Object.assign(LoginRocket.jwkSet, certs)
      return certs
    })
    .catch(this.client.handleError)
  }

  // @private
  get globalJwkSet() {
    return LoginRocket.jwkSet
  }

}
LoginRocket.jwkSet = {}
// {kid => {key: RSAKey, algo: 'RS256'}, ...}
