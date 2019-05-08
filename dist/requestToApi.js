"use strict"
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i]
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p]
        }
        return t
      }
    return __assign.apply(this, arguments)
  }
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value)
            }).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __generator =
  (this && this.__generator) ||
  function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
          if (t[0] & 1) throw t[1]
          return t[1]
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function() {
          return this
        }),
      g
    )
    function verb(n) {
      return function(v) {
        return step([n, v])
      }
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.")
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                    ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t
          if (((y = 0), t)) op = [op[0] & 2, t.value]
          switch (op[0]) {
            case 0:
            case 1:
              t = op
              break
            case 4:
              _.label++
              return { value: op[1], done: false }
            case 5:
              _.label++
              y = op[1]
              op = [0]
              continue
            case 7:
              op = _.ops.pop()
              _.trys.pop()
              continue
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0
                continue
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1]
                break
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1]
                t = op
                break
              }
              if (t && _.label < t[2]) {
                _.label = t[2]
                _.ops.push(op)
                break
              }
              if (t[2]) _.ops.pop()
              _.trys.pop()
              continue
          }
          op = body.call(thisArg, _)
        } catch (e) {
          op = [6, e]
          y = 0
        } finally {
          f = t = 0
        }
      if (op[0] & 5) throw op[1]
      return { value: op[0] ? op[1] : void 0, done: true }
    }
  }
var _this = this
Object.defineProperty(exports, "__esModule", { value: true })
var requestToApi = function(args) {
  var _a
  var body = args.body,
    cancel = args.cancel,
    headers = args.headers,
    method = args.method,
    _b = args.onProgress,
    onProgress =
      _b === void 0
        ? function() {
            return null
          }
        : _b,
    onTimeout = args.onTimeout,
    params = args.params,
    onIntercept = args.onIntercept,
    url = args.url,
    _c = args.timeout,
    timeout = _c === void 0 ? 0 : _c
  var defaultHeaders = ((_a = {
    Accept: "application/json;charset=UTF-8",
  }),
  (_a["Content-Type"] =
    method === "FORM_DATA" ? "multipart/form-data" : "application/json"),
  _a)
  var formData = new FormData()
  var route = url
  var interceptedResult = null
  // (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void
  var handleError = function(error, request, reject) {
    return __awaiter(_this, void 0, void 0, function() {
      return __generator(this, function(_a) {
        reject({
          request: request,
          response: request.response,
        })
        return [2 /*return*/]
      })
    })
  }
  var handleTimeout = function(request, reject) {
    request.abort()
    if (onTimeout) {
      onTimeout()
    }
    reject("Your request took more than " + timeout + "ms to resolve.")
  }
  var returnData = function(request, resolve, reject, isCancel) {
    return __awaiter(_this, void 0, void 0, function() {
      var response, isOK, response, _a, _b
      return __generator(this, function(_c) {
        switch (_c.label) {
          case 0:
            if (isCancel) {
              response = {
                data: { cancelled: true },
                isOK: true,
                request: request,
                status: request.status,
              }
              resolve(response)
            }
            if (!(request.readyState === 4)) return [3 /*break*/, 5]
            isOK = request.status >= 200 && request.status <= 299
            if (!isOK) return [3 /*break*/, 4]
            _a = {}
            if (!request.responseText) return [3 /*break*/, 2]
            return [4 /*yield*/, JSON.parse(request.responseText)]
          case 1:
            _b = _c.sent()
            return [3 /*break*/, 3]
          case 2:
            _b = undefined
            _c.label = 3
          case 3:
            response = ((_a.data = _b),
            (_a.isOK = isOK),
            (_a.request = request),
            (_a.status = request.status),
            _a)
            resolve(response)
            return [3 /*break*/, 5]
          case 4:
            if (onIntercept) {
              interceptedResult = onIntercept({
                currentParams: args,
                request: request,
                status: request.status,
              })
              if (interceptedResult) {
                resolve(
                  requestToApi(
                    __assign({}, interceptedResult, { onIntercept: undefined })
                  )
                )
              } else {
                handleError(request, request, reject)
              }
            } else {
              handleError(request, request, reject)
            }
            _c.label = 5
          case 5:
            return [2 /*return*/]
        }
      })
    })
  }
  var setHeaders = function(request) {
    Object.keys(defaultHeaders).map(function(defaultHeader) {
      return request.setRequestHeader(
        defaultHeader,
        String(defaultHeaders[defaultHeader])
      )
    })
    if (headers && Object.keys(headers).length > 0) {
      Object.keys(headers).map(function(header) {
        return request.setRequestHeader(header, headers[header])
      })
    }
  }
  if (method === "FORM_DATA" && body && Object.keys(body).length > 0) {
    Object.keys(body).map(function(entry) {
      return formData.append(entry, body[entry])
    })
  }
  if (params && Object.keys(params).length > 0) {
    Object.keys(params).map(function(param, index) {
      return index === 0
        ? (route = route + "?" + param + "=" + JSON.stringify(params[param]))
        : (route = route + "&" + param + "=" + JSON.stringify(params[param]))
    })
  }
  var sendRequest = function() {
    return new Promise(function(resolve, reject) {
      try {
        var request_1 = new XMLHttpRequest()
        if (request_1.upload) {
          request_1.upload.onerror = function(error) {
            return handleError(error, request_1, resolve)
          }
          request_1.upload.onload = function() {
            return returnData(request_1, resolve, reject)
          }
          request_1.upload.onprogress = onProgress
          request_1.upload.ontimeout = function() {
            return handleTimeout(request_1, reject)
          }
        }
        request_1.onerror = function(error) {
          return handleError(error, request_1, resolve)
        }
        request_1.onprogress = onProgress
        request_1.onreadystatechange = function() {
          return returnData(request_1, resolve, reject)
        }
        request_1.ontimeout = function() {
          return handleTimeout(request_1, reject)
        }
        request_1.open(method === "FORM_DATA" ? "POST" : method, route)
        request_1.timeout = timeout
        setHeaders(request_1)
        if (cancel) {
          returnData(request_1, resolve, reject, true)
        }
        request_1.send(
          method === "FORM_DATA"
            ? formData
            : method === "DELETE" ||
              method === "GET" ||
              method === "HEAD" ||
              method === "PUT"
              ? null
              : JSON.stringify(__assign({}, body))
        )
        if (cancel) {
          request_1.abort()
        }
      } catch (request) {
        handleError(request, request, reject)
      }
    })
  }
  return sendRequest()
}
exports.default = requestToApi
