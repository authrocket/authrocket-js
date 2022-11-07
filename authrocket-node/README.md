# AuthRocket

[AuthRocket](https://authrocket.com/) provides Auth as a Service, making it quick and easy to add signups, logins, social auth, a full user management UI, and much more to your app.

The `authrocket-node` library covers all of our Core API. It also covers select portions of the Configuration API.

See also `authrocket-middleware` for our streamlined integration with Express and other compatible frameworks.


## Installation

The library is designed to be installed using `npm` or `yarn`.

For installation, run one of:
```bash
npm install @authrocket/authrocket-node

yarn add @authrocket/authrocket-node
```


## Client Basics

### Using environment variables

If you are using environment variables to manage external services like AuthRocket, then it's very easy to initialize the AuthRocket client:

```js
const { AuthRocket } = require('@authrocket/authrocket-node')
const authrocket = new AuthRocket()
```

Ensure these environment variables are set:

```bash
# If only validating tokens (including use with authrocket-middleware)
LOGINROCKET_URL    = https://SAMPLE.e2.loginrocket.com/

# If only validating tokens and default JWT key type has been changed to HS256
LOGINROCKET_URL    = https://SAMPLE.e2.loginrocket.com/
AUTHROCKET_JWT_KEY = SAMPLE

# To use the AuthRocket API
AUTHROCKET_API_KEY = ks_SAMPLE
AUTHROCKET_URL     = https://api-e2.authrocket.com/v2
AUTHROCKET_REALM   = rl_SAMPLE  # optional, but recommended (see below)
# plus LOGINROCKET_URL and/or AUTHROCKET_JWT_KEY if also validating tokens or using authrocket-middleware
```

`AUTHROCKET_API_KEY = ks_SAMPLE`
Your AuthRocket API key. Required to use the API (but not if only performing JWT verification of login tokens).

`AUTHROCKET_JWT_KEY = SAMPLE`
Used to perform JWT signing verification of login tokens. Not required if validating all tokens using the API instead. Also not required if LOGINROCKET_URL is set and RS256 keys are being used, as public keys will be auto-retrieved. This is a realm-specific value, so like `AUTHROCKET_REALM`, set it directly if using multiple realms (see below).

`AUTHROCKET_REALM = rl_SAMPLE`
Sets an application-wide default realm ID. If you're using a single realm, this is definitely easiest. Certain multi-tenant apps might use multiple realms. In this case, don't set this globally, but directly when constructing the client (see below).

`AUTHROCKET_URL = https://api-e2.authrocket.com/v2`
The URL of the AuthRocket API server. This may vary depending on which cluster your service is provisioned on.

`LOGINROCKET_URL = https://SAMPLE.e2.loginrocket.com/`
The LoginRocket URL for your Connected App. Used by `authrocket-middleware` (for redirects) and for auto-retrieval of RS256 JWT keys (if AUTHROCKET_JWT_KEY is not set). If your app uses multiple realms, you may need to set this directly instead (see below). If you're using a custom domain, this will be that domain and will not contain 'loginrocket.com'.

If you are using multiple realms, we recommend building a new client for each realm, directly setting `realm`, `jwtKey`, and/or `loginrocketUrl`:

```js
const authrocket = new AuthRocket({
  realm:          'rl_SAMPLE',
  jwtKey:         'SAMPLE',
  loginrocketUrl: 'https://SAMPLE.e2.loginrocket.com/'
})
```

Similarly, if changing locales between requests, build a new client for each:

```js
const authrocket = new AuthRocket({
  locale: 'es'
})
```


### Direct configuration

It's also possible to directly configure all AuthRocket client instance options:

```js
const { AuthRocket } = require('@authrocket/authrocket-node')
const authrocket = new AuthRocket({
  apiKey:         'ks_SAMPLE',
  url:            'https://api-e2.authrocket.com/v2',
  realm:          'rl_SAMPLE',
  jwtKey:         'SAMPLE',
  loginrocketUrl: 'https://SAMPLE.e2.loginrocket.com/',
  locale:         'en'
})
```

Remember that it's insecure to commit `apiKey` into your code. You may safely commit `url`, `realm`, and `loginrocketUrl`.

If `jwtKey` is an RSA key (starts with 'MIIB' or with 'PUBLIC KEY'), it is also safe to commit. If it starts with 'jsk' or anything else, it is *unsafe* to commit with your code.


## Usage

Documentation is provided on our site:

* [Node.js Integration Guide](https://authrocket.com/docs/integration/node)
* [Node.js SDK Docs](https://authrocket.com/docs/sdks/node) (Expands on this README)
* [API Docs with Node.js examples](https://authrocket.com/docs/api#core-api)


## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request


## License

MIT
