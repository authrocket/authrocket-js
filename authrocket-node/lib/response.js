class Response {

  static parseResponse(response) {
    let data = {},
        errors = [],
        metadata = {},
        body = response.data
    if (body.errors) {
      errors.push(...body.errors)
      delete body.errors
      metadata = body
    } else if (body.collection) {
      data = body.collection
      delete body.collection
      metadata = body
    } else if (response.status == 215) {
      metadata = body
    } else {
      data = body || {}
    }
    if ((response.status == 409 || response.status == 422) && errors.length == 0) {
      errors.push('Validation error')
    }
    return new Response(data, metadata, errors)
  }


  constructor(data, metadata, errors) {
    if (!Array.isArray(data)) {
      for (const key in data) {
        this[key] = data[key]
      }
    }
    this.errors = errors
    this.metadata = metadata
    this.results = data
  }

  hasErrors() {
    return this.errors.length > 0
  }

  errorMessages() {
    return this.errors.join('; ')
  }

  hasMore() {
    return this.metadata.more_results
  }

}

module.exports = Response
