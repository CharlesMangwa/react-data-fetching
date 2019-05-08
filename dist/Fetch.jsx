"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var invariant_1 = __importDefault(require("invariant"));
var react_1 = __importStar(require("react"));
var react_lifecycles_compat_1 = require("react-lifecycles-compat");
// import PropTypes from "prop-types";
var FetchProvider_1 = require("./FetchProvider");
var requestToApi_1 = __importDefault(require("./requestToApi"));
var util_1 = require("./util");
var defaultProps = {
    body: {},
    cancel: false,
    children: undefined,
    component: undefined,
    context: {},
    loader: undefined,
    method: "GET",
    onError: undefined,
    onFetch: undefined,
    onLoad: undefined,
    onProgress: undefined,
    onTimeout: undefined,
    params: {},
    path: undefined,
    refetchKey: undefined,
    render: undefined,
    resultOnly: false,
    timeout: -1,
    url: undefined,
};
var defaultize = function (props) { return (__assign({}, defaultProps, props)); };
var Fetch = /** @class */ (function (_super) {
    __extends(Fetch, _super);
    function Fetch() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.didCallOnLoad = false;
        _this.isLoaded = false;
        _this.isUnmounted = false;
        return _this;
    }
    Fetch.prototype.componentDidMount = function () {
        var _a = defaultize(this.props), context = _a.context, onLoad = _a.onLoad, path = _a.path;
        if (onLoad && !this.didCallOnLoad) {
            this.didCallOnLoad = true;
            onLoad();
        }
        if (path === "store") {
            this.handleData({
                data: context.store,
                isOK: true,
            });
        }
        else {
            this.fetchData();
        }
    };
    Fetch.prototype.componentDidUpdate = function (prevProps) {
        this.validateProps(this.props);
        var _a = defaultize(this.props), context = _a.context, onLoad = _a.onLoad, path = _a.path, refetchKey = _a.refetchKey;
        if (onLoad && !this.didCallOnLoad) {
            this.didCallOnLoad = true;
            onLoad();
        }
        if (refetchKey !== prevProps.refetchKey) {
            if (path === "store") {
                this.isLoaded = true;
                this.handleData({
                    data: context.store,
                    isOK: true,
                });
            }
            else {
                this.isLoaded = false;
                this.fetchData();
            }
        }
    };
    Fetch.prototype.componentWillUnmount = function () {
        this.isUnmounted = true;
    };
    Fetch.prototype.shouldComponentUpdate = function (nextProps) {
        var defaultized = defaultize(this.props);
        var nextDefaultized = defaultize(nextProps);
        if (defaultized.cancel !== nextDefaultized.cancel) {
            return true;
        }
        if (defaultized.children !== nextDefaultized.children) {
            return true;
        }
        if (defaultized.loader !== nextDefaultized.loader) {
            return true;
        }
        if (defaultized.onError !== nextDefaultized.onError) {
            return true;
        }
        if (defaultized.onFetch !== nextDefaultized.onFetch) {
            return true;
        }
        if (defaultized.onLoad !== nextDefaultized.onLoad) {
            return true;
        }
        if (defaultized.path !== nextDefaultized.path) {
            return true;
        }
        if (defaultized.params !== nextDefaultized.params) {
            return true;
        }
        if (defaultized.refetchKey !== nextDefaultized.refetchKey) {
            return true;
        }
        if (defaultized.render !== nextDefaultized.render) {
            return true;
        }
        if (this.isLoaded) {
            return true;
        }
        if (this.data) {
            return true;
        }
        return false;
    };
    Fetch.prototype.render = function () {
        var _a = defaultize(this.props), children = _a.children, component = _a.component, render = _a.render;
        if (!this.isLoaded && !this.isUnmounted) {
            return this.renderLoader();
        }
        if (this.isLoaded && !this.isUnmounted) {
            if (component) {
                return react_1.createElement(component, this.data);
            }
            if (typeof render === "function" && this.data) {
                return render(this.data);
            }
            if (typeof children === "function" && this.data) {
                return children(this.data);
            }
            if (children && !util_1.isEmptyChildren(children)) {
                return react_1.Children.only(children);
            }
        }
        return null;
    };
    Fetch.prototype.fetchData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, body, cancel, context, headers, method, onIntercept, onProgress, onTimeout, params, path, url, timeout, route, timeoutValue, apiResponse, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = defaultize(this.props), body = _a.body, cancel = _a.cancel, context = _a.context, headers = _a.headers, method = _a.method, onIntercept = _a.onIntercept, onProgress = _a.onProgress, onTimeout = _a.onTimeout, params = _a.params, path = _a.path, url = _a.url, timeout = _a.timeout;
                        route = path ? "" + (context.api || "") + path : url;
                        timeoutValue = context.timeout && timeout === -1 ?
                            context.timeout :
                            !context.timeout && timeout ?
                                Math.max(0, timeout) :
                                context.timeout && timeout ?
                                    timeout === -1 ? context.timeout : timeout :
                                    0;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, requestToApi_1.default({
                                body: __assign({}, body),
                                cancel: cancel,
                                headers: __assign({}, context.headers, headers),
                                method: method,
                                onIntercept: onIntercept || context.onIntercept,
                                onProgress: onProgress,
                                onTimeout: onTimeout,
                                params: __assign({}, params),
                                timeout: timeoutValue,
                                url: route || "",
                            })];
                    case 2:
                        apiResponse = _b.sent();
                        if (!this.isUnmounted) {
                            this.handleData(__assign({}, apiResponse, { store: context.store }));
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        if (!this.isUnmounted) {
                            this.handleData({
                                error: {
                                    content: error_1,
                                    message: "Something went wrong during the request",
                                    url: route,
                                },
                                isOK: false,
                                store: context.store,
                            });
                            if (process.env.NODE_ENV !== "production") {
                                invariant_1.default(!error_1, "<Fetch /> tried to call the route \"" + String(route) + "\" " +
                                    ("with \"" + String(method).toUpperCase() + "\" method ") +
                                    "but resolved with the following error: %s\n", this.printError(error_1));
                            }
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Fetch.prototype.handleData = function (result) {
        var resultOnly = defaultize(this.props).resultOnly;
        if (!this.isUnmounted) {
            this.isLoaded = true;
            resultOnly
                ? (this.data = result.error || result.data)
                : (this.data = result);
            this.returnData(result);
        }
    };
    Fetch.prototype.printError = function (error) {
        return error.response && JSON.stringify(error.response).length
            ? typeof error.response === "string"
                ? error.response
                : typeof error.response === "object"
                    ? JSON.stringify(error.response, null, 2)
                    : error.response + ". \"Check error.content to see what happened."
            : "Check error.content to see what happened.";
    };
    Fetch.prototype.renderLoader = function () {
        var _a = defaultize(this.props), context = _a.context, loader = _a.loader;
        if (context.loader && !loader) {
            return typeof context.loader === "function"
                ? context.loader()
                : context.loader;
        }
        if (!context.loader && loader) {
            return typeof loader === "function" ? loader() : loader;
        }
        if (context.loader && loader) {
            return typeof loader === "function" ? loader() : loader;
        }
        return null;
    };
    Fetch.prototype.returnData = function (result) {
        var _a = defaultize(this.props), onError = _a.onError, onFetch = _a.onFetch;
        if (onFetch) {
            onFetch(this.data);
        }
        if (result.error && onError) {
            onError(this.data);
        }
        if (!this.isUnmounted) {
            this.forceUpdate();
        }
    };
    Fetch.prototype.validateProps = function (props) {
        var _a = defaultize(props), children = _a.children, component = _a.component, context = _a.context, onTimeout = _a.onTimeout, onFetch = _a.onFetch, path = _a.path, render = _a.render, timeout = _a.timeout, url = _a.url;
        invariant_1.default(path || url, "You must provide a `url` or a `path` to <Fetch />");
        if (path) {
            invariant_1.default(path && context.api, "You must implement <FetchProvider> at the root of your " +
                "app and provide a URL to `value.api` prop in order to use `path`");
        }
        if (path === "store") {
            invariant_1.default(path && context.store, "You must implement <FetchProvider> at the root of your " +
                "app and provide an object to `value.store` prop " +
                "in order to use `store`");
        }
        if (onTimeout) {
            invariant_1.default((typeof timeout === "number" && timeout >= 0) ||
                (typeof context.timeout === "number" && context.timeout >= 0), "You must provide a `timeout` number in ms to <Fetch /> or " +
                "<FetchProvider> in order to use `onTimeout`");
        }
        invariant_1.default(children || component || render || onFetch, "You must provide at least one of the following " +
            "to <Fetch />: children, `component`, `onFetch`, `render`");
    };
    return Fetch;
}(react_1.Component));
exports.Fetch = Fetch;
var withContext = function (FetchComponent) { return function (props) { return (<FetchProvider_1.Consumer>{function (data) { return <FetchComponent {...props} context={data}/>; }}</FetchProvider_1.Consumer>); }; };
exports.default = withContext(react_lifecycles_compat_1.polyfill(Fetch));
