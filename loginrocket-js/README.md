# LoginRocket

[AuthRocket](https://authrocket.com/) provides Auth as a Service, making it quick and easy to add signups, logins, social auth, a full user management UI, and much more to your app.

The `loginrocket.js` library is for the LoginRocket API, which is our API for untrusted clients like web browsers and mobile apps. It does not require exposing an API key.

For server-side apps which are able to properly protect an API key, also see `authrocket-node`.

`loginrocket.js` is designed to work with a wide variety of JS frameworks, including React, Angular, Vue, Svelte, Stimulus, and even jQuery, as well as vanilla Javascript.


## Installation

If you use a package manager, install as usual with one of:
```bash
npm install @authrocket/loginrocket

yarn add @authrocket/loginrocket

pnpm add @authrocket/loginrocket
```


## Client Basics

### Configuring the client

Start by initializing the LoginRocket client. You'll need your AuthRocket Realm's **LoginRocket URL** for this:

```js
import LoginRocket from '@authrocket/loginrocket'
const loginrocket = new LoginRocket({
  url:    'https://SAMPLE.e2.loginrocket.com/',
  locale: 'en'
})
```

`locale` is optional and may also be set/changed later. If unspecified, an intelligent default will be used based on the user's browser and other available settings. If you provide a direct way for users to change locales, you'll probably want to sync this with that setting.


## Usage

Documentation is provided on our site:

* [LoginRocket.js Integration Guide](https://authrocket.com/docs/integration/js)
* [Loginrocket.js SDK Docs](https://authrocket.com/docs/sdks/js) (Expands on this README)
* [LoginRocket API Docs with examples](https://authrocket.com/docs/api/loginrocket)


## Contributing

See [parent README](../README.md#contributing).


## License

[MIT](../LICENSE.txt)
