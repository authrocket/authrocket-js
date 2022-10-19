# LoginRocket

[AuthRocket](https://authrocket.com/) provides Auth as a Service, making it quick and easy to add signups, logins, social auth, a full user management UI, and much more to your app.

The `loginrocket-js` library is for the LoginRocket API, which is our API for untrusted clients like web browsers and mobile apps. It does not require exposing an API key.

For server-side apps which are able to properly protect an API key, also see `authrocket-node`.

`loginrocket-js` is designed to work with a wide variety of JS frameworks, including React, Angular, Vue, Svelte, Stimulus, and even jQuery, as well as vanilla Javascript.


## Installation

If you use a bundler like `npm` or `yarn`, install the package as usual with one of:
```bash
npm install @authrocket/loginrocket-js

yarn add @authrocket/loginrocket-js
```


## Client Basics

### Configuring the client

Start by initializing the LoginRocket client. You'll need your AuthRocket Realm's **LoginRocket URL** for this:

```js
import { LoginRocket } from '@authrocket/loginrocket-js'
const loginrocket = new LoginRocket({
  url:    'https://SAMPLE.e2.loginrocket.com/',
  locale: 'en'
})
```

`locale` is optional and may also be set/changed later. If unspecified, an intelligent default will be used based on the user's browser and other available settings. If you provide a direct way for users to change locales, you'll probably want to sync this with that setting.


## Usage

Documentation is provided on our site:

* [LoginRocket API Documentation](https://authrocket.com/docs/api/loginrocket)


## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request


## License

MIT
