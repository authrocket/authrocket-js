import Resource from './resource.js'

export default class AuthProvider extends Resource {

  constructor(client) {
    super(client)
    this.path        = 'auth_providers'
    this.rootElement = 'auth_provider'
  }

  // params = {
  //   redirect_uri: 'https://...',
  //   nonce:        'randomString'  // optional
  // }
  authorizeUrls(params={}) {
    const path = `${this.path}/authorize`
    return this.client.get(path, params)
  }

  // params = {
  //   redirect_uri: 'https://...',
  //   nonce:        'randomString'  // optional
  // }
  authorizeUrl(id, params={}) {
    if (!id)
      return this.isBlankError()
    const path = `${this.path}/${encodeURI(id)}/authorize`
    return this.client.get(path, params)
  }

  // params = {
  //   code:  '...',
  //   nonce: 'randomString',  // optional
  //   state: '...'
  // }
  authorize(params={}) {
    const path = `${this.path}/authorize`
    return this.client.post(path, params)
  }

  // params = {
  //   code:  '...',
  //   nonce: 'randomString',  // optional
  //   state: '...'
  // }
  authorizeToken(id, params={}) {
    if (!id)
      return this.isBlankError()
    const path = `${this.path}/${encodeURI(id)}/authorize`
    return this.client.post(path, params)
  }

}
