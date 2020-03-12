class arRequest {

  constructor(p) {
    this.arClient      = p.authrocket
    this.cookieName    = p.cookie
    this.cookieOptions = p.cookieOptions
    this.req           = p.req
    this.res           = p.res
  }

  get currentMembership() {
    if (!this.currentUser) 
      return
    return this.currentUser.memberships.find(m => m.selected) || this.currentUser.memberships[0]
  }

  get currentOrg() {
    return this.currentMembership && this.currentMembership.org
  }

  get currentSession() {
    return this.sessionObj
  }

  set currentSession(v) {
    this.sessionObj = v
  }

  get currentUser() {
    return this.currentSession && this.currentSession.user
  }


  logout() {
    this.clearCookie()
  }


  // @private
  setCookie(sess) {
    if (!this.cookieName) return
    if (this.cookieOptions.maxAge || this.cookieOptions.expires) {
      var opt = Object.assign({}, this.cookieOptions)
    } else {
      var opt = Object.assign({expires: new Date(sess.expires_at*1000)}, this.cookieOptions)
    }
    if (opt.secure == 'auto')
      opt.secure = this.req.secure
    this.res.cookie(this.cookieName, sess.token, opt)
  }

  // @private
  clearCookie() {
    if (!this.cookieName) return
    var opt = Object.assign({}, this.cookieOptions)
    delete opt.expires
    delete opt.maxAge
    if (opt.secure == 'auto')
      opt.secure = this.req.secure
    this.res.clearCookie(this.cookieName, opt)
  }

  // @private
  getCookie() {
    if (!this.cookieName) return
    return this.req.cookies[this.cookieName]
  }


  arAccountUrl(params={}) {
    let id = params.id || (this.currentOrg && this.currentOrg.id)
    if (id) {
      delete params.id
      return this.loginrocketUrl(`/accounts/${id}`, params)
    }
    return this.arAccountsUrl(params)
  }

  // force - if falsey, does not add ?force; else does add it
  arAccountsUrl(params={}) {
    if (params.force || params.force === undefined) {
      params.force = 1
    } else {
      delete params.force
    }
    return this.loginrocketUrl('/accounts', params)
  }

  arLoginUrl(params={}) {
    return this.loginrocketUrl('/login', params)
  }

  arLogoutUrl(params={}) {
    if (this.currentSession)
      params.session = this.currentSession.id
    return this.loginrocketUrl('/logout', params)
  }

  arProfileUrl(params={}) {
    return this.loginrocketUrl('/profile', params)
  }

  arSignupUrl(params={}) {
    return this.loginrocketUrl('/signup', params)
  }

  loginrocketUrl(path, params={}) {
    let uri = this.arClient.loginrocketUrl
    if (path)
      uri.pathname = path
    if (!uri.pathname)
      uri.pathname = '/'
    Object.entries(params).forEach(([k,v])=>{
      uri.searchParams.append(k, v)
    })
    return uri.href
  }

  requestUri(uri) {
    return new URL(uri||this.req.originalUrl, `${this.req.protocol}://${this.req.headers.host}`)
  }

  safeThisUri() {
    let uri = this.requestUri()
    if (this.req.method=='GET') {
      ['account', 'session', 'token'].forEach((p)=>{
        uri.searchParams.delete(p)
      })
    }
    return uri.href
  }

}

module.exports = arRequest
