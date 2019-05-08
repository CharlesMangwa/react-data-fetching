"use strict"
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, "__esModule", { value: true })
var create_react_context_1 = __importDefault(require("create-react-context"))
var ctx = {
  api: undefined,
  headers: {},
  loader: undefined,
  onIntercept: undefined,
  store: undefined,
  timeout: undefined,
}
var _a = create_react_context_1.default(ctx),
  Provider = _a.Provider,
  Consumer = _a.Consumer
exports.Consumer = Consumer
exports.default = Provider
