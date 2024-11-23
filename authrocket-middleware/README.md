# AuthRocket

[AuthRocket](https://authrocket.com/) provides Auth as a Service, making it quick and easy to add signups, logins, social auth, a full user management UI, and much more to your app.

The `authrocket-middleware` enables our streamlined integration with Express and other compatible frameworks.

If it's possible to use the middleware as-is, we highly recommend it as this will get you up and running as quickly as possible. If not possible, then the code here will still serve as a valuable reference.

To talk directly to our API, see `authrocket-node` as well. Both libraries work well together if you need functionality provided by each.


## Usage

`authrocket-middleware` is designed to work with Express and any other framework that uses Express-compatible middleware, such as Connect.

Start by adding the npm package to your project.

Depending on your package manager, run one of:
```bash
npm install @authrocket/authrocket-middleware

yarn add @authrocket/authrocket-middleware

pnpm add @authrocket/authrocket-middleware
```


#### Setting up the middleware and /logout route

Next, add the middleware to your app (most commonly in `app.js`).

```js
// add this near the top with the rest of your import statements:
import { arMiddleware, cookieParser, fullLogout, requireLogin } from '@authrocket/authrocket-middleware'

// ensure this is in your middleware list (anywhere before arMiddleware):
app.use(cookieParser())

// add this at the end of your middleware list, and *before* your routes:
app.use(arMiddleware({
  authrocket: {
    loginrocketUrl: 'https://SAMPLE.e2.loginrocket.com/'
  }
}))

// add this with the rest of your routes (at the beginning is fine)
app.use('/logout', fullLogout)
```

`loginrocketUrl` will be unique to your app and is available in the AuthRocket management portal at Realm -> Integration -> LoginRocket Web.

Alternatively, you may use an environment variable instead:

```bash
LOGINROCKET_URL=https://SAMPLE.e2.loginrocket.com/
```

Then setup `arMiddleware` like so:
```js
app.use(arMiddleware())
```


#### Protecting resources

You may require a login to access your entire app, individual routes, or a group of routes via a sub-router.

In all cases, if a user is already logged in, each route will proceed normally. If a user isn't logged in yet, they'll be redirected to your LoginRocket page, and after logging in (or signing up), will be redirect back to the original route.

##### Entire app

Add `requireLogin` as another middleware. Make sure it's *after* `arMiddleware`:
```js
app.use(requireLogin)
```

##### Individual routes

Add `requireLogin` to individual routes:
```js
app.get('/protected',
  requireLogin,
  function(req, res, next) {
    // normal route behavior here, eg:
    res.render('protected')
  }
)
```

This works the same for sub-routes (`router.get(...)`) too.

##### Groups of routes

A common pattern is to group a set of routes into a sub-router.

For example, `app.js` might have something like this:
```js
app.use('/admin', adminRouter)
```

Then to `admin.js`, you'll add this:
```js
// ...existing import statements
import { requireLogin } from '@authrocket/authrocket-middleware'
router.use(requireLogin)

// ...router.get('/', ...)
```


#### Helpers for account and user info & generating links

`authrocket-middleware` also provides a number of helper functions for use in your routes/controllers and your views.

In your routes, helpers are accessed using `req.authrocket.currentOrg`. In your views, the same would be accessed simply as `authrocket.currentOrg`. Remaining examples will use the shorter version, but the same set of helpers is available in both places.

The current Membership and Org (account) are accessible as:

    authrocket.currentOrg
    authrocket.currentMembership

Similarly, the current User and Session are also available:

    authrocket.currentUser
    authrocket.currentSession

A number of URL/link helpers make it easy to build the proper links to move users seamlessly between LoginRocket and your app:

    authrocket.arLoginUrl()     // Login
    authrocket.arSignupUrl()    // Signup
    authrocket.arProfileUrl()   // Manage profile
    authrocket.arAccountUrl()   // Manage current account
    authrocket.arAccountsUrl()  // Switch accounts (when using AuthRocket in team/multi-user mode)

Here's a simple example nav using pug/jade that demonstrates a few of these:

```jade
body
  nav
    if authrocket.currentUser
      span Hi, #{authrocket.currentUser.name}!
      a(href=authrocket.arProfileUrl({redirect_uri: authrocket.requestUri()})) Manage Profile
      a(href='/logout') Logout
    else
      a(href=authrocket.arSignupUrl()) Signup
      a(href=authrocket.arLoginUrl()) Login
```



## Customizing the integration

The middleware's default configuration tries to handle as much for you as possible. However, there may be times when you want to modify the default behavior.


#### Logouts

By default, visiting `/logout` will log the user out of both your app *and* LoginRocket. In some instances, you might want to log them out of your app, but not LoginRocket.

To do this, simply change this:

    import { fullLogout } from '@authrocket/authrocket-middleware'
    ...
    app.use('/logout', fullLogout)

to this:

    import { localLogout } from '@authrocket/authrocket-middleware'
    ...
    app.use('/logout', localLogout)


#### arMiddleware

`arMiddleware` supports some configuration options:

```js
arMiddleware({
  // This object used to configure the AuthRocket client internally. It is the same as provided
  //   to `new AuthRocket({...})` when using `authrocket-node`.
  authrocket: { ... },

  // Disables storage of token in cookies.
  // cookie: false,

  // Change the default settings used to create the token-storing cookie.
  cookieOptions: {
    httpOnly: true,
    // maxAge: 86400000,        // Default: matches expiration of the token
    secure: 'auto',             // 'auto' becomes true if site accessed via https, else false
    // any other param supported by Node's Response.cookie()
  },
})
```


#### Cookies

`authrocket-middleware` uses a cookie called `arToken` to persist the token. This uses the `cookie-parser` plugin. arMiddleware imports this for you (you may also import your own version directly), but you still need to enable it. Customize the settings using `cookie` or `cookieOptions` as described above.

If disabling cookies with `cookie: false` (see above), `cookieParser` may also be skipped. This is generally only appropriate for API-only apps (see below).


## Building an API app

If your backend is just an API, perhaps because your frontend is a separate SPA, then login tokens work a little differently.

Your frontend will need to capture the login token directly, save it, and then add it to requests to the backend.

On the backend, `authrocket-middleware` will automatically detect bearer tokens sent via the Authorization header. The frontend (or any other client) simply needs to send this HTTP header:

    Authorization: Bearer TOKEN-GOES-HERE



## Reference

Documentation is provided on our site:

* [Node.js + Express Integration Guide](https://authrocket.com/docs/integration/express)
* [Express/middleware SDK Docs](https://authrocket.com/docs/sdks/express) (Expands on this README)
* [Node.js SDK Docs](https://authrocket.com/docs/sdks/node)
* [API Docs with Node.js examples](https://authrocket.com/docs/api#core-api)


## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request


## License

MIT
