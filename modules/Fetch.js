/* @flow */
/* eslint camelcase: 0 */

import React, { Children, Component, createElement } from 'react'
import { polyfill } from 'react-lifecycles-compat'
import PropTypes from 'prop-types'
import invariant from 'invariant'

import requestToApi from './requestToApi'
import { Consumer } from './FetchProvider'
import {
  type ErrorContent,
  type Error as ErrorType,
  type Props,
  type ReturnedData,
  contextShape,
  methodShape,
} from './types'

const isEmptyChildren = children => Children.count(children) === 0

class Fetch extends Component<Props> {
  _data: ?ReturnedData | ErrorType = undefined

  _didCallOnLoad = false

  _isLoaded = false

  _isUnmounted = false

  static propTypes = {
    body: PropTypes.object,
    cancel: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    context: contextShape,
    method: methodShape,
    loader: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    onError: PropTypes.func,
    onFetch: PropTypes.func,
    onLoad: PropTypes.func,
    onProgress: PropTypes.func,
    onTimeout: PropTypes.func,
    params: PropTypes.object,
    path: PropTypes.string,
    refetchKey: PropTypes.any,
    render: PropTypes.func,
    resultOnly: PropTypes.bool,
    url: PropTypes.string,
    timeout: PropTypes.number,
  }

  static defaultProps = {
    body: {},
    cancel: false,
    children: undefined,
    component: undefined,
    context: {},
    loader: undefined,
    method: 'GET',
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
    url: undefined,
    timeout: -1,
  }

  // @TODO: Move this to cdM to be StrictMode compliant
  UNSAFE_componentWillMount() {
    this._validateProps(this.props)
    if (this.props.onLoad && !this._didCallOnLoad) {
      this._didCallOnLoad = true
      this.props.onLoad()
    }
  }

  componentDidMount() {
    if (this.props.path === 'store') {
      this._handleData({
        data: this.props.context.store,
        isOK: true,
      })
    } else this._fetchData(this.props)
  }

  componentDidUpdate(prevProps: Props) {
    this._validateProps(this.props)

    if (this.props.onLoad && !this._didCallOnLoad) {
      this._didCallOnLoad = true
      this.props.onLoad()
    }

    if (this.props.refetchKey !== prevProps.refetchKey) {
      if (this.props.path === 'store') {
        this._isLoaded = true
        this._handleData({
          data: this.props.context.store,
          isOK: true,
        })
      } else {
        this._isLoaded = false
        this._fetchData(this.props)
      }
    }
  }

  componentWillUnmount() {
    this._isUnmounted = true
  }

  shouldComponentUpdate(nextProps: Props) {
    if (this.props.cancel !== nextProps.cancel) return true
    if (this.props.children !== nextProps.children) return true
    if (this.props.loader !== nextProps.loader) return true
    if (this.props.onError !== nextProps.onError) return true
    if (this.props.onFetch !== nextProps.onFetch) return true
    if (this.props.onLoad !== nextProps.onLoad) return true
    if (this.props.path !== nextProps.path) return true
    if (this.props.params !== nextProps.params) return true
    if (this.props.refetchKey !== nextProps.refetchKey) return true
    if (this.props.render !== nextProps.render) return true
    if (this._isLoaded) return true
    if (this._data) return true
    return false
  }

  _fetchData = async (props: Props): Promise<void> => {
    const {
      body,
      cancel,
      context,
      headers,
      method,
      onIntercept,
      onProgress,
      onTimeout,
      params,
      path,
      url,
      timeout,
    } = props
    let route: ?string
    let timeoutValue = 0

    if (path) route = `${context.api || ''}${path}`
    else route = url

    if (context.timeout && timeout === -1) timeoutValue = context.timeout
    else if (!context.timeout && timeout) timeoutValue = Math.max(0, timeout)
    else if (context.timeout && timeout)
      timeoutValue = timeout === -1 ? context.timeout : timeout

    try {
      const apiResponse = await requestToApi({
        url: route || '',
        body: { ...body },
        cancel,
        headers: { ...context.headers, ...headers },
        method,
        onTimeout,
        onProgress,
        onIntercept: onIntercept || context.onIntercept,
        params: { ...params },
        timeout: timeoutValue,
      })
      if (!this._isUnmounted) {
        this._handleData({
          ...apiResponse,
          store: context.store,
        })
      }
    } catch (error) {
      if (!this._isUnmounted) {
        this._handleData({
          error: {
            content: error,
            message: 'Something went wrong during the request',
            url: route,
          },
          isOK: false,
          store: context.store,
        })
        if (process.env.NODE_ENV !== 'production') {
          invariant(
            !error,
            `<Fetch /> tried to call the route "${String(route)}" ` +
              `with "${String(method).toUpperCase()}" method ` +
              'but resolved with the following error: %s\n',
            this._printError(error)
          )
        }
      }
    }
  }

  _handleData = (result: ReturnedData) => {
    if (!this._isUnmounted) {
      this._isLoaded = true
      this.props.resultOnly
        ? (this._data = result.error || result.data)
        : (this._data = result)
      this._returnData(result)
    }
  }

  _printError = (error: ErrorContent): string =>
    error.response && JSON.stringify(error.response).length
      ? typeof error.response === 'string'
        ? error.response
        : typeof error.response === 'object'
          ? JSON.stringify(error.response, null, 2)
          : `${error.response}. 'Check error.content to see what happened.`
      : 'Check error.content to see what happened.'

  _renderLoader = (): React$Node => {
    const { context, loader } = this.props

    if (context.loader && !loader) {
      return typeof context.loader === 'function'
        ? context.loader()
        : context.loader
    }
    if (!context.loader && loader)
      return typeof loader === 'function' ? loader() : loader
    if (context.loader && loader)
      return typeof loader === 'function' ? loader() : loader

    return null
  }

  _returnData = (result: ReturnedData) => {
    const { onError, onFetch } = this.props

    if (onFetch) onFetch(this._data)

    if (result.error && onError) onError(this._data)

    if (!this._isUnmounted) this.forceUpdate()
  }

  _validateProps = (props: Props) => {
    const {
      children,
      component,
      context,
      onTimeout,
      onFetch,
      path,
      render,
      timeout,
      url,
    } = props

    invariant(path || url, 'You must provide a `url` or a `path` to <Fetch />')

    if (path) {
      invariant(
        path && context.api,
        'You must implement <FetchProvider> at the root of your ' +
          'app and provide a URL to `value.api` prop in order to use `path`'
      )
    }

    if (path === 'store') {
      invariant(
        path && context.store,
        'You must implement <FetchProvider> at the root of your ' +
          'app and provide an object to `value.store` prop ' +
          'in order to use `store`'
      )
    }

    if (onTimeout) {
      invariant(
        (typeof timeout === 'number' && timeout >= 0) ||
          (typeof context.timeout === 'number' && context.timeout >= 0),
        'You must provide a `timeout` number in ms to <Fetch /> or ' +
          '<FetchProvider> in order to use `onTimeout`'
      )
    }

    invariant(
      children || component || render || onFetch,
      'You must provide at least one of the following ' +
        'to <Fetch />: children, `component`, `onFetch`, `render`'
    )
  }

  render() {
    const { children, component, render } = this.props

    if (!this._isLoaded && !this._isUnmounted) return this._renderLoader()

    if (this._isLoaded && !this._isUnmounted) {
      if (component) return createElement(component, this._data)

      if (typeof render === 'function') return render(this._data)

      if (typeof children === 'function') return children(this._data)

      if (children && !isEmptyChildren(children)) return Children.only(children)
    }

    return null
  }
}

const withContext = (
  FetchComponent: React$ComponentType<Props>
): React$ComponentType<Props> => (props: Props): React$Element<*> => (
  <Consumer>{data => <FetchComponent {...props} context={data} />}</Consumer>
)

export default withContext(polyfill(Fetch))
export { Fetch }
