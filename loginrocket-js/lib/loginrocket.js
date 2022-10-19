/*!
 * AuthRocket JavaScript Library - loginrocket.js
 * Copyright 2022 Notioneer, Inc.
 * https://authrocket.com/
 *
 * API docs    : https://authrocket.com/docs/api/loginrocket
 */


import axios from 'axios'


export class LoginRocketError extends Error {}
export class AccessDenied extends LoginRocketError {}
export class RateLimited extends LoginRocketError {}
export class RecordNotFound extends LoginRocketError {}


export class LoginRocket {
  static VERSION = '1.0.0'

  constructor(params={}) {
    this.config = {
      headers: {
        'Content-Type': 'application/json',
        'LR-Agent': `LoginRocket/js v${LoginRocket.VERSION}`
      },
    }
    this.lrUrl = params.url
    this.locale = params.locale
  }


  login(params={}) {
    return this.post('login', params)
  }

  verifyLogin(params={}) {
    return this.post('login/verify', params)
  }

  logout(params={}) {
    return this.delete('session', params)
  }

  getSession(params={}) {
    return this.get('session', params)
  }

  forgotPassword(params={}) {
    return this.post('password/forgot', params)
  }

  resetPassword(params={}) {
    return this.post('password/reset', params)
  }

  updatePassword(params={}) {
    return this.post('profile/password', params)
  }

  updateProfile(params={}) {
    return this.put('profile', params)
  }

  requestInvitation(params={}) {
    return this.post('signup/request', params)
  }

  signup(params={}) {
    return this.post('signup', params)
  }

  verifyEmail(params={}) {
    return this.post('email/verify', params)
  }



  get locale() {
    return this.config.headers['Accept-Language']
  }

  set locale(locale) {
    if (locale)
      this.config.headers['Accept-Language'] = locale
    else
      delete this.config.headers['Accept-Language']
  }


  get lrUrl() {
    if (!this.config.lrUrl)
      throw new LoginRocketError("Missing LR url: set LoginRocket({url: ...})")
    return this.config.lrUrl
  }

  set lrUrl(url) {
    if (!url)
      return
    if (!url.match(/\/$/))
      url = url + '/'
    if (!url.match(/v2\/$/))
      url = url + 'v2/'
    this.config.lrUrl = url
  }


  // @protected
  get(url, params={}) {
    return this.request({
      method: 'get',
      url: url,
      params: params
    })
  }

  // @protected
  post(url, params={}) {
    return this.request({
      method: 'post',
      url: url,
      data: params
    })
  }

  // @protected
  put(url, params={}) {
    return this.request({
      method: 'put',
      url: url,
      data: params
    })
  }

  // @protected
  delete(url, params={}) {
    return this.request({
      method: 'delete',
      url: url,
      params: params
    })
  }


  // @private
  request(params) {
    return axios.request({
      baseURL: this.lrUrl,
      timeout: 4000,
      headers: this.config.headers,
      validateStatus: this.checkStatus,
      ...params
    })
    .then(resp => resp.data)
    .catch(this.handleError)
    .catch(this.normalizeError)
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
        case 403:
          throw new AccessDenied('Session expired or access denied.')
          break
        case 404:
          throw new RecordNotFound(`Record not found: ${error.config.url}`)
          break
        case 429:
          throw new RateLimited('Rate limited; wait before trying again.')
          break
        default:
          if (status >= 400 && status <= 499)
            throw new LoginRocketError(`Client error: ${status}`, {cause: error})
          if (status >= 500 && status <= 599)
            throw new LoginRocketError(`Server error: ${status}`, {cause: error})
      }
    } else if (error.request) {
      // performed request, but no response
      throw new LoginRocketError(`No response received from: ${error.config.url}`, {cause: error})
    } else if (error.config) {
      throw new LoginRocketError(`Unable to make request for: ${error.config.url}`, {cause: error})
    }
    throw error
  }

  // @private
  normalizeError(error) {
    let msg
    if (error instanceof AccessDenied || error instanceof RateLimited) {
      msg = error.message
    } else if (error instanceof LoginRocketError) {
      msg = 'An unexpected error occurred; please wait a minute and try again.'
    } else {
      throw error
    }
    return {
      error:  msg,
      errors: [msg],
      result: 'error',
      source: error.constructor.name
    }
  }

}
