import { LoginRocket } from '../lib/loginrocket.js'

class Helper {

  async setup() {
    this.client = new LoginRocket({
      url: process.env.LOGINROCKET_URL,
    })
  }

  async teardown() {
    this.client = null
  }

}

export default new Helper()
