/*!
 * AuthRocket middleware for Express
 * @copyright Notioneer, Inc.
 * @license MIT
 * https://authrocket.com/
 */

/*
usage - install middleware:
  const { arMiddleware } = require('./authrocket-middleware')
  app.use(arMiddleware({
    // options
  }))

usage - require a login:
  const { requireLogin } = require('../authrocket-middleware')
  // in manage.js (all child endpoints):
    router.use(requireLogin)
  // single endpoint:
    router.get('/protected',
      requireLogin,
      function(req, res, next) {
        res.render('protected');
      }
    )

*/

const cookieParser = require('cookie-parser')
const { AuthRocket } = require('@authrocket/authrocket-node')
const arRequest = require('./request')


function fullLogout(req, res, next) {
  req.authrocket.logout()
  res.redirect(req.authrocket.arLogoutUrl({redirect_uri: req.authrocket.requestUri('/')}))
}

function localLogout(req, res, next) {
  req.authrocket.logout()
  res.redirect(req.authrocket.requestUri('/'))
}


function requireLogin(req, res, next) {
  if (req.authrocket.currentSession) {
    next()
  } else {
    res.redirect( req.authrocket.arLoginUrl({redirect_uri: req.authrocket.safeThisUri()}) )
  }
}


function arMiddleware(options) {
  options = Object.assign({
    cookie: 'arToken',
  }, options)
  options.cookieOptions = Object.assign({
    httpOnly: true,
    secure: 'auto',  // auto-detect https
  }, options.cookieOptions)
  let arClient = new AuthRocket(options.authrocket)
  options.authrocket = arClient


  // returns: true if session was updated/replaced
  async function processInboundToken(req) {
    if (req.method != 'GET' || !req.query.token)
      return
    let sess = await arClient.sessions.fromToken(req.query.token)
    if (sess) {
      req.authrocket.currentSession = sess
      req.authrocket.setCookie(sess)
      return true
    }
  }

  async function processAuthorizationHeader(req) {
    if (req.headers.authorization) {
      let match = req.headers.authorization.match(/^Bearer (.+)$/i)
      if (match && match[1]) {
        let sess = await arClient.sessions.fromToken(match[1])
        if (sess)
          req.authrocket.currentSession = sess
      }
    }
  }

  // returns: true if redirected, false if request should continue
  async function setupRequest(req, res) {
    req.authrocket = new arRequest({...options, req, res})
    res.locals.authrocket = req.authrocket

    if (await processInboundToken(req)) {
      // redirect to remove ?token= from url
      res.redirect(req.authrocket.safeThisUri())
      return true
    }

    await processAuthorizationHeader(req)

    if (!req.authrocket.currentSession && req.authrocket.getCookie()) {
      let sess = await arClient.sessions.fromToken(req.authrocket.getCookie())
      if (sess) {
        req.authrocket.currentSession = sess
      } else {
        req.authrocket.clearCookie()
      }
    }

    return false
  }

  return function(req, res, next) {
    setupRequest(req, res).then((performed)=>{
      if (performed)
        return
      else
        next()
    })
  }
}


module.exports = {
  arMiddleware,
  cookieParser,
  fullLogout,
  localLogout,
  requireLogin,
}
