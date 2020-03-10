# AuthRocket

[AuthRocket](https://authrocket.com/) provides Auth as a Service, making it quick and easy to add signups, logins, social auth, a full user management UI, and much more to your app.

The `authrocket-node` library covers all of our Core API. It also covers select portions of the Configuration API.


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
import { AuthRocket } from 'authrocket'
//  or
const { AuthRocket } = require('authrocket')

const authrocket = new AuthRocket()
```

Ensure these environment variables are set:

```bash
AUTHROCKET_API_KEY = ks_SAMPLE
AUTHROCKET_URL     = https://api-e2.authrocket.com/v2
AUTHROCKET_REALM   = rl_SAMPLE  # optional
AUTHROCKET_JWT_KEY = SAMPLE     # optional
```

`AUTHROCKET_URL` may vary based on what cluster your account is provisioned on.

`AUTHROCKET_REALM` and `AUTHROCKET_JWT_KEY` are optional. If you are using multiple realms, we recommend building a new client for each realm, directly setting `realm` and `jwtKey`:

```js
const authrocket = new AuthRocket({
  realm:  'rl_SAMPLE',
  jwtKey: 'SAMPLE'
})
```


### Direct configuration

It's also possible to directly configure all AuthRocket client instance options:

```js
const authrocket = new AuthRocket({
  apiKey: 'ks_SAMPLE',
  url:    'https://api-e2.authrocket.com/v2',
  realm:  'rl_SAMPLE',
  jwtKey: 'SAMPLE'
})
```


## Usage

Documentation is provided on our site:

* [Node Integration Guide](https://authrocket.com/docs/integration/node)
* [API Documentation with Node examples](https://authrocket.com/docs/api/users)


## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request


## License

MIT
