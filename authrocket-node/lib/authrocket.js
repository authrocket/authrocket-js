/*!
 * AuthRocket library for Node.js
 * @copyright Notioneer, Inc.
 * @license MIT
 * https://authrocket.com/
 */

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


import axios from 'axios'
import Response from './response.js'
import * as packageJson from '../package.json' with { type: 'json' }


export class AuthRocketError extends Error {}
export class RecordNotFound extends AuthRocketError {}
export { Response }


export class AuthRocket {

  constructor(params={}, options={}) {
    this.VERSION = packageJson.version
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
    this.locale = config.locale
    this.defaultRealm = config.realm
    if (config.service)
      this.config.headers['Authrocket-Service'] = config.service

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
    if (realmId)
      this.config.headers['Authrocket-Realm'] = realmId
    else
      delete this.config.headers['Authrocket-Realm']
  }

  set locale(locale) {
    if (locale)
      this.config.headers['Accept-Language'] = locale
    else
      delete this.config.headers['Accept-Language']
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


import authProviders from './auth_provider.js'
import clientApps from './client_app.js'
import credentials from './credential.js'
import domains from './domain.js'
import invitations from './invitation.js'
import loginrocket from './loginrocket.js'
import memberships from './membership.js'
import orgs from './org.js'
import realms from './realm.js'
import sessions from './session.js'
import users from './user.js'

const resources = {
  authProviders,
  clientApps,
  credentials,
  domains,
  invitations,
  loginrocket,
  memberships,
  orgs,
  realms,
  sessions,
  users
}
