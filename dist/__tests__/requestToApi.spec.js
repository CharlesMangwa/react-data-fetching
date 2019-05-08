"use strict"
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, "__esModule", { value: true })
var requestToApi_1 = __importDefault(require("../requestToApi"))
describe("requestToApi", function() {
  var mockXHR = {
    abort: jest.fn(),
    getAllResponseHeaders: jest.fn(),
    onload: jest.fn(),
    onreadystatechange: jest.fn(),
    ontimeout: jest.fn(),
    open: jest.fn(),
    readyState: 4,
    responseText: JSON.stringify([{ ok: true, username: "Octocat" }]),
    send: jest.fn(),
    setRequestHeader: jest.fn(),
    status: 200,
  }
  var oldXMLHttpRequest = XMLHttpRequest
  beforeEach(function() {
    window.XMLHttpRequest = jest.fn(function() {
      return mockXHR
    })
  })
  afterEach(function() {
    window.XMLHttpRequest = oldXMLHttpRequest
    jest.clearAllMocks()
  })
  it("should fetch data correctly", function() {
    expect.assertions(1)
    var request = requestToApi_1.default({
      method: "GET",
      url: "https://api.github.com/users/4",
    })
    mockXHR.onreadystatechange()
    request.then(function(result) {
      var response = result.data[0]
      expect(response.username).toEqual("Octocat")
    })
  })
  it("should perform correctly with FORM_DATA method", function() {
    expect.assertions(1)
    var request = requestToApi_1.default({
      body: {
        userName: "Charles",
      },
      method: "FORM_DATA",
      url: "https://api.github.com/users",
    })
    mockXHR.onreadystatechange()
    request.then(function(result) {
      var response = result.data[0]
      expect(response.ok).toBeTruthy()
    })
  })
  it("should perform correctly with GET parameters", function() {
    expect.assertions(1)
    var request = requestToApi_1.default({
      method: "GET",
      params: {
        limit: 20,
        start: 0,
      },
      url: "https://api.github.com/users",
    })
    mockXHR.onreadystatechange()
    request.then(function(result) {
      var response = result.data[0]
      expect(response.ok).toBeTruthy()
    })
  })
  it("should call `onIntercept` when the request failed with a status 401 & retrieve successfully", function() {
    expect.assertions(2)
    var mockFailingXHR = {
      getAllResponseHeaders: jest.fn(),
      onload: jest.fn(),
      onreadystatechange: jest.fn(),
      open: jest.fn(),
      readyState: 4,
      responseText: JSON.stringify({
        message: "Credentials are required to access this path",
      }),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      status: 401,
    }
    var mockResetXHR = {
      getAllResponseHeaders: jest.fn(),
      onload: jest.fn(),
      onreadystatechange: jest.fn(),
      open: jest.fn(),
      readyState: 4,
      responseText: JSON.stringify({
        newToken: "abc123456",
      }),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      status: 201,
    }
    window.XMLHttpRequest = jest.fn(function() {
      return mockFailingXHR
    })
    var onIntercept = jest.fn(function(_a) {
      var currentParams = _a.currentParams,
        status = _a.status
      if (status === 401) {
        window.XMLHttpRequest = jest.fn(function() {
          return mockResetXHR
        })
        var resetRequest = requestToApi_1.default({
          body: {
            resetToken: "abcxzz",
          },
          method: "POST",
          url: "https://api.github.com/auth/reset",
        })
        mockResetXHR.onreadystatechange()
        resetRequest.then(function(result) {
          var response = result.data.newToken
          expect(response).toBe("abc123456")
        })
        window.XMLHttpRequest = jest.fn(function() {
          return mockXHR
        })
        return currentParams
      }
    })
    var request = requestToApi_1.default({
      method: "GET",
      onIntercept: onIntercept,
      params: {
        limit: 20,
        start: 0,
      },
      url: "https://api.github.com/users",
    })
    mockFailingXHR.onreadystatechange()
    request.then(function(result) {
      var response = result.data[0]
      expect(response.ok).toBeTruthy()
    })
    expect(onIntercept).toBeCalled()
  })
  it("should reject when `onIntercept` is `undefined` or returns `null`", function() {
    expect.assertions(2)
    var mockFailingXHR = {
      getAllResponseHeaders: jest.fn(),
      onload: jest.fn(),
      onreadystatechange: jest.fn(),
      open: jest.fn(),
      readyState: 4,
      responseText: JSON.stringify({
        message: "Credentials are required to access this path",
      }),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      status: 401,
    }
    window.XMLHttpRequest = jest.fn(function() {
      return mockFailingXHR
    })
    var onIntercept = jest.fn(function() {
      return undefined
    })
    var request = requestToApi_1.default({
      method: "GET",
      onIntercept: onIntercept,
      params: {
        limit: 20,
        start: 0,
      },
      url: "https://api.github.com/users",
    })
    mockFailingXHR.onreadystatechange()
    request.catch(function(err) {
      var responseText = err.request.responseText
      expect(JSON.parse(responseText).message).toBe(
        "Credentials are required to access this path"
      )
    })
    expect(onIntercept).toBeCalled()
  })
  it("should call `onTimeout` when it's provided & the threshold have been reached", function() {
    expect.assertions(1)
    var fn = jest.fn()
    var request = requestToApi_1.default({
      method: "GET",
      onTimeout: fn,
      timeout: 0.1,
      url: "https://api.github.com/users/4",
    })
    mockXHR.onreadystatechange()
    mockXHR.ontimeout()
    expect(fn).toHaveBeenCalled()
  })
  it("should build final URL from nested `params` objects", function() {
    expect.assertions(2)
    var request = requestToApi_1.default({
      method: "GET",
      params: {
        obj1: {
          limit: 20,
          start: 0,
        },
        obj2: "hello world",
      },
      url: "https://api.github.com/users",
    })
    mockXHR.onreadystatechange()
    expect(mockXHR.open).toHaveBeenCalledWith(
      "GET",
      'https://api.github.com/users?obj1={"limit":20,"start":0}&obj2="hello world"'
    )
    request.then(function(result) {
      var response = result.data[0]
      expect(response.ok).toBeTruthy()
    })
  })
  it("should perform correctly with GET parameters", function() {
    expect.assertions(1)
    var request = requestToApi_1.default({
      method: "GET",
      params: {
        limit: 20,
        start: 0,
      },
      url: "https://api.github.com/users",
    })
    mockXHR.onreadystatechange()
    request.then(function(result) {
      var response = result.data[0]
      expect(response.ok).toBeTruthy()
    })
  })
})
