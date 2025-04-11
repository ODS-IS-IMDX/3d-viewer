// Copyright (c) 2025 NTT InfraNet
const { MockAgent, Agent, setGlobalDispatcher } = require('undici')

const testMock = new MockAgent()

const nock = {
  before: () => {
    setGlobalDispatcher(testMock)
    testMock.disableNetConnect()
  },
  after: async () => {
    await testMock.close()
    setGlobalDispatcher(new Agent())
  },
  get: (url, path, opts) => {
    return testMock.get(url).intercept({
      method: 'GET',
      path,
      ...opts
    })
  },
  post: (url, path, opts) => {
    return testMock.get(url).intercept({
      method: 'POST',
      path,
      ...opts
    })
  },
  put: (url, path, opts) => {
    return testMock.get(url).intercept({
      method: 'PUT',
      path,
      ...opts
    })
  },
  patch: (url, path, opts) => {
    return testMock.get(url).intercept({
      method: 'PATCH',
      path,
      ...opts
    })
  },
  delete: (url, path, opts) => {
    return testMock.get(url).intercept({
      method: 'DELETE',
      path,
      ...opts
    })
  }
}

const HEADER = {
  headers: { 'Content-Type': 'application/json; charset=utf-8' }
}

module.exports = {
  nock,
  HEADER
}
