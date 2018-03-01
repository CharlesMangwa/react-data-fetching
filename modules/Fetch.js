/* @flow */

import { Component } from 'react'
import PropTypes from 'prop-types'
import invariant from 'invariant'

import requestToApi from './requestToApi'
import {
  type Context,
  type Props,
  type ReturnedData,
  methodShape,
} from './types'

class Fetch extends Component<Props> {
  _data: ?ReturnedData = undefined
  _didCallOnLoad: boolean = false
  _isLoaded: boolean = false
  _isUnmounted: boolean = false

  static propTypes = {
    body: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    method: methodShape,
    loader: PropTypes.func,
    onError: PropTypes.func,
    onLoad: PropTypes.func,
    onProgress: PropTypes.func,
    onSuccess: PropTypes.func,
    onTimeout: PropTypes.func,
    params: PropTypes.object,
    path: PropTypes.string,
    refetch: PropTypes.bool,
    render: PropTypes.func,
    resultOnly: PropTypes.bool,
    url: PropTypes.string,
    timeout: PropTypes.number,
  }

  static contextTypes = {
    rdfApi: PropTypes.string,
    rdfHeaders: PropTypes.object,
    rdfStore: PropTypes.object,
    rdfTimeout: PropTypes.number,
  }

  static defaultProps = {
    body: {},
    children: undefined,
    loader: undefined,
    method: 'GET',
    onError: undefined,
    onLoad: undefined,
    onProgress: undefined,
    onSuccess: undefined,
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
    if (this.props.path === 'redux') {
      this._handleData({
        data: this.context.rdfStore,
        isOK: true,
      })
    }
    else this._fetchData(this.props, this.context)
  }

  componentWillReceiveProps(nextProps: Props, nextContext: Context) {
    this._validateProps(nextProps, nextContext)
    if (this.props.onLoad && !this._didCallOnLoad) {
      this._didCallOnLoad = true
      this.props.onLoad()
    }
    if (this.props.path === 'redux') {
      this._handleData({
        data: this.context.rdfStore,
        isOK: true,
      })
    }
    else if (
      nextProps.path !== this.props.path ||
      nextProps.refetch !== this.props.refetch
    )
      this._fetchData(nextProps, nextContext)
  }

  componentWillUnmount() {
    this._isUnmounted = true
  }

  shouldComponentUpdate = (nextProps: Props): boolean => {
    if (this.props.children !== nextProps.children) return true
    if (this.props.loader !== nextProps.loader) return true
    if (this.props.onError !== nextProps.onError) return true
    if (this.props.onLoad !== nextProps.onLoad) return true
    if (this.props.onSuccess !== nextProps.onSuccess) return true
    if (this.props.path !== nextProps.path) return true
    if (this.props.params !== nextProps.params) return true
    if (this.props.refetch !== nextProps.refetch) return true
    if (this.props.render !== nextProps.render) return true
    if (this._isLoaded) return true
    if (this._data) return true
    return false
  }

  _fetchData = async (props: Props, context: Context): Promise<*> => {
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
    let timeoutValue = 0

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
            message: 'Something went wrong during the request 😲...',
            url: route,
          },
          isOK: false,
          store: context.rdfStore,
        })
        if (process.env.NODE_ENV !== 'production') {
          invariant(
            !error,
            `<Fetch> tried to call the route "${String(route)}" ` +
              'but resolved with the following error: %s\n',
            JSON.stringify(error.response || error.request._response))
        }
      }
    }
  }

  _handleData = (result: ReturnedData): void => {
    if (!this._isUnmounted) {
      this._isLoaded = true
      if (!result.error) {
        this.props.resultOnly
          ? (this._data = result.data)
          : (this._data = result)
      }
      this._returnData(result)
    }
  }

  _returnData = (result: ReturnedData): void => {
    if (this.props.onSuccess) {
      this.props.resultOnly
        ? this.props.onSuccess(result && result.data)
        : this.props.onSuccess(result)
    }
    if (result.error && this.props.onError) {
      this.props.resultOnly
        ? this.props.onError(result.error)
        : this.props.onError(result)
    }
    if (!this._isUnmounted) this.forceUpdate()
  }

  _validateProps = (props: Props, context: Context): void => {
    invariant(
      props.path || props.url,
      'You must provide a `url` or a `path` to <Fetch>',
    )

    if (props.path) {
      invariant(
        props.path && context.rdfApi,
        'You must implement <ConnectedFetch> at the route of your ' +
          'app and provide an `api` in order to use `path`',
      )
    }

    if (props.onTimeout) {
      invariant(
        props.timeout !== -1 || context.rdfTimeout,
        'You must provide a `timeout` in ms to <Fetch> or <ConnectedFetch>',
      )
    }

    invariant(
      props.children || props.render || props.onSuccess,
      'You must provide at least one of the following ' +
        'to <Fetch>: children, `onSuccess`, `render`',
    )
  }

  render() {
    if (!this._isLoaded && !this._isUnmounted && this.props.loader)
      return this.props.loader()
    if (this._isLoaded && !this._isUnmounted) {
      if (this.props.render) {
        return this.props.resultOnly
          ? this.props.render(this._data)
          : this.props.render(this._data)
      }
      if (this.props.children) {
        return typeof this.props.children === 'function'
          ? this.props.resultOnly
            ? this.props.children(this._data)
            : this.props.children(this._data)
          : this.props.children
      }
    }
    return null
  }
}

export default Fetch
