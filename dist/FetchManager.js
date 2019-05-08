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
Object.defineProperty(exports, "__esModule", { value: true })
var FetchManager = /** @class */ (function() {
  function FetchManager() {
    var _this = this
    this.refCounter = 0
    this.subscriptions = []
    this.get = function(ref) {
      var index = _this.subscriptions.findIndex(function(subscription) {
        return subscription ? subscription.ref === ref : false
      })
      if (index > -1) {
        return _this.subscriptions[index]
      }
      return null
    }
  }
  FetchManager.prototype.subscribe = function(subscriptionProps) {
    var subscription = __assign({ ref: this.refCounter }, subscriptionProps)
    this.refCounter += 1
    this.subscriptions = this.subscriptions.concat([subscription])
    return subscription.ref
  }
  FetchManager.prototype.update = function(ref, newSubscriptionProps) {
    var index = this.subscriptions.findIndex(function(subscription) {
      return subscription ? subscription.ref === ref : false
    })
    if (index > -1) {
      this.subscriptions = this.subscriptions
        .slice(0, index)
        .concat(
          [__assign({ ref: ref }, newSubscriptionProps)],
          this.subscriptions.slice(index + 1)
        )
      return true
    }
    return false
  }
  FetchManager.prototype.unsubscribe = function(ref) {
    var index = this.subscriptions.findIndex(function(subscription) {
      return subscription ? subscription.ref === ref : false
    })
    if (index > -1) {
      this.subscriptions = this.subscriptions
        .slice(0, index)
        .concat(this.subscriptions.slice(index + 1))
      return true
    }
    return false
  }
  FetchManager.prototype.getAll = function() {
    return this.subscriptions
  }
  return FetchManager
})()
exports.default = new FetchManager()
