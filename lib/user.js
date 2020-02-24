const Resource = require('./resource')

class User extends Resource {

  constructor(client) {
    super(client)
    this.path        = 'users'
    this.rootElement = 'user'
  }

  // params = {
  //   current_password: 'old',
  //   password: 'new',
  //   password_confirmation: 'new'
  // }
  updatePassword(id, params={}) {
    if (!id)
      return this.isBlankError()
    const path = `${this.path}/${encodeURI(id)}/update_password`
    params = this.buildRoot(params)
    return this.client.put(path, params)
  }

  // params = {
  //   email: '...',
  //   first_name: '...',
  //   last_name: '...',
  //   password: 'new',
  //   password_confirmation: 'new',
  //   username: '...'
  // }
  updateProfile(id, params={}) {
    if (!id)
      return this.isBlankError()
    const path = `${this.path}/${encodeURI(id)}/profile`
    params = this.buildRoot(params)
    return this.client.put(path, params)
  }

  // params = {
  //   password: 'secret'
  // }
  authenticate(id, params={}) {
    const path = `${this.path}/${encodeURI(id)}/authenticate`
    params = this.buildRoot(params)
    return this.client.post(path, params)
  }

  // params = {
  //   token: '...',
  //   code: '123456'
  // }
  authenticateToken(params={}) {
    const path = `${this.path}/authenticate_token`
    params = this.buildRoot(params)
    return this.client.post(path, params)
  }

  requestEmailVerification(id, params={}) {
    if (!id)
      return this.isBlankError()
    const path = `${this.path}/${encodeURI(id)}/request_email_verification`
    return this.client.post(path, params)
  }

  // params = {
  //   token: '...'
  // }
  verifyEmail(params={}) {
    const path = `${this.path}/verify_email`
    params = this.buildRoot(params)
    return this.client.post(path, params)
  }

  generatePasswordToken(id, params={}) {
    const path = `${this.path}/${encodeURI(id)}/generate_password_token`
    return this.client.post(path, params)
  }

  // params = {
  //   token: '...',
  //   password: 'new',
  //   password_confirmation: 'new'
  // }
  resetPasswordWithToken(params={}) {
    const path = `${this.path}/reset_password_with_token`
    params = this.buildRoot(params)
    return this.client.post(path, params)
  }

  // params = {
  //   token: '...'
  // }
  acceptInvitation(id, params={}) {
    const path = `${this.path}/${encodeURI(id)}/accept_invitation`
    params = this.buildRoot(params)
    return this.client.post(path, params)
  }
}

module.exports = User
