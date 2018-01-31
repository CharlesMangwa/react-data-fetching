/* @flow */

import { Component } from 'react'
import PropTypes from 'prop-types'
import invariant from 'invariant'

import requestToApi from './requestToApi'
import {
  type Context,
  type Props,
  type ReturnedData,
  paramsShape,
} from './types'

class Fetch extends Component<Props> {
  _data: ?ReturnedData = undefined
  _didCallOnLoad: boolean = false
  _isLoaded: boolean = false
  _isUnmounted: boolean = false

  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    loader: PropTypes.func,
    onError: PropTypes.func,
    onLoad: PropTypes.func,
    onSuccess: PropTypes.func,
    params: paramsShape,
    path: PropTypes.string.isRequired,
    refetch: PropTypes.bool,
    render: PropTypes.func,
    resultOnly: PropTypes.bool,
  }

  static contextTypes = {
    rdfApi: PropTypes.string,
    rdfHeaders: PropTypes.object,
    rdfStore: PropTypes.object,
  }

  static defaultProps = {
    children: undefined,
    loader: undefined,
    onError: undefined,
    onLoad: undefined,
    onSuccess: undefined,
    params: {
      method: 'GET',
      body: {},
    },
    refetch: false,
    render: undefined,
    resultOnly: false,
  }

  componentWillMount() {
    this._validateProps(this.props)
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
    this._validateProps(nextProps)
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
    const { headers, path, params } = props
    const body = params && params.body ? params.body : {}
    const method = params && params.method ? params.method : 'GET'

    try {
      const apiResponse = await requestToApi(
        `${context.rdfApi || ''}${path}`,
        method,
        body,
        { ...context.rdfHeaders, ...headers },
      )
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
          error: 'Something went wrong during the request 😲...',
          isOK: false,
          store: context.rdfStore,
        })
        invariant(!error, `Route "${path}" resolved with: %s`, error)
      }
    }
  }

  _returnData = (result: ReturnedData): void => {
    if (this.props.onSuccess) {
      this.props.resultOnly
        ? this.props.onSuccess(result && result.data)
        : this.props.onSuccess(result)
    }
    if (result.error && this.props.onError)
      this.props.onError(result)
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

  _validateProps = (props: Props): void => {
    invariant(props.path, 'You must provide a `path` to <Fetch>')

    invariant(
      props.children || props.onSuccess || props.render,
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
