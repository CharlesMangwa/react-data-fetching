/* @flow */

import { Children, Component, createElement } from 'react'
import PropTypes from 'prop-types'
import invariant from 'invariant'

import requestToApi from './requestToApi'
import {
  type Context,
  type ErrorContent,
  type Error,
  type Props,
  type ReturnedData,
  methodShape,
} from './types'

const isEmptyChildren = children => Children.count(children) === 0

class Fetch extends Component<Props> {
  _data: ?ReturnedData | Error = undefined
  _didCallOnLoad = false
  _isLoaded = false
  _isUnmounted = false

  static propTypes = {
    body: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    method: methodShape,
    loader: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    onError: PropTypes.func,
    onFetch: PropTypes.func,
    onLoad: PropTypes.func,
    onProgress: PropTypes.func,
    onTimeout: PropTypes.func,
    params: PropTypes.object,
    path: PropTypes.string,
    refetch: PropTypes.any,
    render: PropTypes.func,
    resultOnly: PropTypes.bool,
    url: PropTypes.string,
    timeout: PropTypes.number,
  }

  static contextTypes = {
    rdfApi: PropTypes.string,
    rdfHeaders: PropTypes.object,
    rdfLoader: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    rdfStore: PropTypes.object,
    rdfTimeout: PropTypes.number,
  }

  static defaultProps = {
    body: {},
    children: undefined,
    component: undefined,
    loader: undefined,
    method: 'GET',
    onError: undefined,
    onFetch: undefined,
    onLoad: undefined,
    onProgress: undefined,
    onTimeout: undefined,
    params: {},
    path: undefined,
    refetch: false,
    render: undefined,
    resultOnly: false,
    url: undefined,
    timeout: -1,
  }

  componentWillMount() {
    this._validateProps(this.props, this.context)
    if (this.props.onLoad && !this._didCallOnLoad) {
      this._didCallOnLoad = true
      this.props.onLoad()
    }
  }

  componentDidMount() {
    if (this.props.path === 'store') {
      this._handleData({
        data: this.context.rdfStore,
        isOK: true,
      })
    }
    else this._fetchData(this.props, this.context)
  }

  componentWillReceiveProps(nextProps: Props, nextContext: Context) {
    const { onLoad, path, refetch } = this.props

    this._validateProps(nextProps, nextContext)

    if (onLoad && !this._didCallOnLoad) {
      this._didCallOnLoad = true
      onLoad()
    }

    if (path === 'store') {
      this._handleData({
        data: this.context.rdfStore,
        isOK: true,
      })
    }
    else if (
      nextProps.path !== path ||
      nextProps.refetch !== refetch
    )
      this._fetchData(nextProps, nextContext)
  }

  componentWillUnmount() {
    this._isUnmounted = true
  }

  shouldComponentUpdate(nextProps: Props) {
    if (this.props.children !== nextProps.children) return true
    if (this.props.loader !== nextProps.loader) return true
    if (this.props.onError !== nextProps.onError) return true
    if (this.props.onFetch !== nextProps.onFetch) return true
    if (this.props.onLoad !== nextProps.onLoad) return true
    if (this.props.path !== nextProps.path) return true
    if (this.props.params !== nextProps.params) return true
    if (this.props.refetch !== nextProps.refetch) return true
    if (this.props.render !== nextProps.render) return true
    if (this._isLoaded) return true
    if (this._data) return true
    return false
  }

  _fetchData = async (props: Props, context: Context): Promise<void> => {
    const {
      body,
      headers,
      method,
      onProgress,
      onTimeout,
      params,
      path,
      url,
      timeout,
    } = props
    let route: ?string
    let timeoutValue: number = 0

    if (path) route = `${context.rdfApi || ''}${path}`
    else route = url

    if (context.rdfTimeout && timeout === -1)
      timeoutValue = context.rdfTimeout
    else if (!context.rdfTimeout && timeout)
      timeoutValue = Math.max(0, timeout)
    else if (context.rdfTimeout && timeout) {
      timeoutValue = timeout === -1
        ? context.rdfTimeout
        : timeout
    }

    try {
      const apiResponse = await requestToApi({
        url: route || '',
        body: { ...body },
        headers: { ...context.rdfHeaders, ...headers },
        method,
        onTimeout,
        onProgress,
        params: { ...params },
        timeout: timeoutValue,
      })
      if (!this._isUnmounted) {
        this._handleData({
          ...apiResponse,
          store: context.rdfStore,
        })
      }
    }
    catch (error) {
      if (!this._isUnmounted) {
        this._handleData({
          error: {
            content: error,
            message: 'Something went wrong during the request',
            url: route,
          },
          isOK: false,
          store: context.rdfStore,
        })
        if (process.env.NODE_ENV !== 'production') {
          invariant(
            !error,
            `<Fetch> tried to call the route "${String(route)}" ` +
              `with "${String(method).toUpperCase()}" method ` +
              'but resolved with the following error: %s\n',
            this._printError(error),
          )
        }
      }
    }
  }

  _handleData = (result: ReturnedData): void => {
    if (!this._isUnmounted) {
      this._isLoaded = true
      this.props.resultOnly
        ? (this._data = result.error || result.data)
        : (this._data = result)
      this._returnData(result)
    }
  }

  _printError = (error: ErrorContent): string => (
    error.response && JSON.stringify(error.response).length
      ? typeof error.response === 'string'
        ? error.response
        : typeof error.response === 'object'
          ? JSON.stringify(error.response)
          : `${error.response}. Sorry <Fetch> couldn't turned this into a readable string. `
            + 'Check error.content.request to see what happened.'
      : error.request._response
        ? typeof error.request._response === 'string'
          ? error.request._response
          : typeof error.request._response === 'object'
            ? JSON.stringify(error.request._response)
            : `${String(error.request._response)}. Sorry <Fetch> couldn't turned this into a readable string. `
              + 'Check error.content.request to see what happened.'
        : " .Sorry <Fetch> couldn't turned this into a readable string. "
            + 'Check error.content.request to see what happened.'
  )

  _renderLoader = (): React$Node => {
    const { rdfLoader } = this.context
    const { loader } = this.props

    if (rdfLoader && !loader) {
      return typeof rdfLoader === 'function'
        ? rdfLoader() : rdfLoader
    }
    else if (!rdfLoader && loader) {
      return typeof loader === 'function'
        ? loader() : loader
    }
    else if (rdfLoader && loader) {
      return typeof loader === 'function'
        ? loader() : loader
    }

    return null
  }

  _returnData = (result: ReturnedData): void => {
    const { onError, onFetch } = this.props

    if (onFetch) onFetch(this._data)

    if (result.error && onError) onError(this._data)

    if (!this._isUnmounted) this.forceUpdate()
  }

  _validateProps = (props: Props, context: Context): void => {
    const { rdfApi, rdfStore, rdfTimeout } = context
    const {
      children,
      component,
      onTimeout,
      onFetch,
      path,
      render,
      timeout,
      url,
    } = props

    invariant(
      path || url,
      'You must provide a `url` or a `path` to <Fetch>',
    )

    if (path) {
      invariant(
        path && rdfApi,
        'You must implement <ConnectedFetch> at the root of your '
          + 'app and provide an `api` in order to use `path`',
      )
    }

    if (path === 'store') {
      invariant(
        path && rdfStore,
        'You must implement <ConnectedFetch> at the root of your '
          + 'app and provide a `store` in order to use `path="store"`',
      )
    }

    if (onTimeout) {
      invariant(
        (typeof timeout === 'number' && timeout >= 0) ||
        (typeof rdfTimeout === 'number' && rdfTimeout >= 0),
        'You must provide a `timeout` number in ms to <Fetch> or <ConnectedFetch> '
          + 'in order to use `onTimeout`',
      )
    }

    invariant(
      children || component || render || onFetch,
      'You must provide at least one of the following '
        + 'to <Fetch>: children, `component`, `onFetch`, `render`',
    )
  }

  render(): React$Node {
    const { children, component, render } = this.props

    if (!this._isLoaded && !this._isUnmounted)
      return this._renderLoader()

    if (this._isLoaded && !this._isUnmounted) {
      if (component) return createElement(component, this._data)

      if (render) return render(this._data)

      if (typeof children === 'function') return children(this._data)

      if (children && !isEmptyChildren(children))
        return Children.only(children)
    }

    return null
  }
}

export default Fetch
