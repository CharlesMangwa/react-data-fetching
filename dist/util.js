"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
var react_1 = require("react")
exports.isEmptyChildren = function(children) {
  return react_1.Children.count(children) === 0
}
