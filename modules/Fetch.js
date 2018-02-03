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
    onSuccess: PropTypes.func,
    params: PropTypes.object,
    path: PropTypes.string,
    refetch: PropTypes.bool,
    render: PropTypes.func,
    resultOnly: PropTypes.bool,
    url: PropTypes.string,
  }

  static contextTypes = {
    rdfApi: PropTypes.string,
    rdfHeaders: PropTypes.object,
    rdfStore: PropTypes.object,
  }

  static defaultProps = {
    body: {},
    children: undefined,
    loader: undefined,
    method: 'GET',
    onError: undefined,
    onLoad: undefined,
    onSuccess: undefined,
    params: {},
    path: undefined,
    refetch: false,
    render: undefined,
    resultOnly: false,
    url: undefined,
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
    const { body, headers, method, params, path, url } = props
    let route: ?string

    if (path)
      route = `${context.rdfApi || ''}${path}`
    else route = url

    try {
      const apiResponse = await requestToApi({
        url: route || '',
        method,
        body: { ...body },
        headers: { ...context.rdfHeaders, ...headers },
        params: { ...params },
      })
      if (!this._isUnmounted) {
        apiResponse.isOK
          ? this._handleData({
            data: apiResponse.result,
            isOK: apiResponse.isOK,
            response: apiResponse.response,
            status: apiResponse.status,
            store: context.rdfStore,
          })
          : this._handleData({
            error: apiResponse,
            isOK: apiResponse.isOK,
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
        // invariant(!error, `Route "${path}" resolved with: %s`, error)
      }
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

  _handleData = (result: ReturnedData): void => {
    if (!this._isUnmounted) {
      this._isLoaded = true
      if (!result.error) {
        this.props.resultOnly
          ? this._data = result.data
          : this._data = result
      }
      this._returnData(result)
    }
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
