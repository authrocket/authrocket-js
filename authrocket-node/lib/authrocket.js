/*
  usage:

  client = new AuthRocket({
    url:    'https://api-e2.authrocket.com/v2',
    apiKey: 'ks_SAMPLE',
    realm:  'rl_SAMPLE',
    jwtKey: 'SAMPLE'
  })

  client.orgs.all()
  client.orgs.first()
  client.orgs.find('org_SAMPLE')
  client.orgs.create({...})
  client.orgs.update('org_SAMPLE', {...})
  client.orgs.delete('org_SAMPLE')

*/


const axios = require('axios')
const Response = require('./response')


class AuthRocketError extends Error {}
class RecordNotFound extends AuthRocketError {}


class AuthRocket {

  constructor(params={}, options={}) {
    this.VERSION = require('../package.json').version
    let config = {}
    if (!options.skipAutoConfig) {
      config = {
        url:     process.env.AUTHROCKET_URL,
        apiKey:  process.env.AUTHROCKET_API_KEY,
        realm:   process.env.AUTHROCKET_REALM,
        service: process.env.AUTHROCKET_SERVICE,
        jwtKey:  process.env.AUTHROCKET_JWT_KEY,
        loginrocketUrl: process.env.LOGINROCKET_URL,
      }
    }
    Object.assign(config, params)

    this.config = {}
    this.defaultJwtKey = config.jwtKey
    this.config.loginrocketUrl = config.loginrocketUrl
    this.config.headers = {
      'Accept-Encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
      'User-Agent': `AuthRocket/node v${this.VERSION}`,
      'Authrocket-Api-Key': config.apiKey
    }
    if (config.service)
      this.config.headers['Authrocket-Service'] = config.service
    if (config.realm)
      this.config.headers['Authrocket-Realm'] = config.realm

    if (config.url)
      this.config.url = config.url[-1] == '/' ? config.url : config.url+'/'
    this.config.verifySsl = !(config.verifySsl === false)

    this.loadResources()
  }


  get defaultJwtKey() {
    return this.config.jwtKey
  }

  set defaultJwtKey(jwtKey) {
    this.config.jwtKey = jwtKey
  }

  set defaultRealm(realmId) {
    this.config.headers['Authrocket-Realm'] = realmId
  }

  get loginrocketUrl() {
    if (!this.config.loginrocketUrl)
      throw new AuthRocketError("Missing AR loginrocketUrl: set LOGINROCKET_URL or AuthRocket({loginrocketUrl: ...})")
    return new URL(this.config.loginrocketUrl)
  }


  get(url, params={}) {
    return this.request({
      method: 'get',
      url: url,
      params: params
    })
  }

  post(url, params={}) {
    return this.request({
      method: 'post',
      url: url,
      data: params
    })
  }

  put(url, params={}) {
    return this.request({
      method: 'put',
      url: url,
      data: params
    })
  }

  delete(url, params={}) {
    return this.request({
      method: 'delete',
      url: url,
      params: params
    })
  }


  // @protected
  request(params) {
    if (!this.config.url)
      throw new AuthRocketError("Missing AR URL: set AUTHROCKET_URL or AuthRocket(url: ...)")
    if (!this.config.headers['Authrocket-Api-Key'])
      throw new AuthRocketError("Missing AR API key: set AUTHROCKET_API_KEY or AuthRocket(apiKey: ...)")

    return axios.request({
      baseURL: this.config.url,
      timeout: 50000,
      headers: this.config.headers,
      validateStatus: this.checkStatus,
      ...params
    })
    .then(Response.parseResponse)
    .catch(this.handleError)
  }


  // @private
  checkStatus(status) {
    return (status >= 200 && status < 300) || status == 409 || status == 422
  }

  // @private
  handleError(error) {
    if (error.response) {
      const status = error.response.status
      // did get response, but checkStatus failed
      switch (status) {
        case 402:
          throw new AuthRocketError("Account inactive; login to portal to check service status")
          break
        case 403:
          throw new AuthRocketError("Access denied; check your API credentials and permissions")
          break
        case 404:
          throw new RecordNotFound(`Record not found: ${error.config.url}`)
          break
        case 429:
          throw new AuthRocketError("Rate limited; wait before trying again")
          break
        default:
          if (status >= 400 && status <= 499)
            throw new AuthRocketError(`Client error: ${status} -- ${error.response.data}`)
          if (status >= 500 && status <= 599)
            throw new AuthRocketError(`Server error: ${status} -- ${error.response.data}`)
      }
    } else if (error.request) {
      // performed request, but no response
      throw new AuthRocketError(`No response received from: ${error.config.url}`)
    } else if (error.config) {
      throw new AuthRocketError(`Unable to make request for: ${error.config.url}`)
    }
    throw error
  }


  loadResources() {
    for (const name in resources) {
      this[name] = new resources[name](this)
    }
  }

}

module.exports = {
  AuthRocket,
  AuthRocketError,
  RecordNotFound,
  Response
}


const resources = {
  authProviders: require('./auth_provider'),
  clientApps: require('./client_app'),
  credentials: require('./credential'),
  domains: require('./domain'),
  invitations: require('./invitation'),
  loginrocket: require('./loginrocket'),
  memberships: require('./membership'),
  orgs: require('./org'),
  realms: require('./realm'),
  sessions: require('./session'),
  users: require('./user')
}
