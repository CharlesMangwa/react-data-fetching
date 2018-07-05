/* @flow */

import { Children, Component, createElement } from "react"
import PropTypes from "prop-types"
import invariant from "invariant"

import requestToApi from "./requestToApi"
import Data from "./Data"

import {
  type ErrorContent,
  type ReturnedData,
  type DataHandler,
  type FetchDataProps as Props,
  methodShape
} from "./types"

type State = {
  data: DataHandler
}

class FetchData extends Component<Props, State> {
  _isUnmounted : boolean = false

  state = {
    data: Data.init()
  }

  static propTypes = {
    body: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    subscribe: PropTypes.object,
    render: PropTypes.func,
    url: PropTypes.string,
    fetch: PropTypes.func,
    options: PropTypes.shape({
      method: methodShape,
      params: PropTypes.object,
      refetchKey: PropTypes.any,
      timeout: PropTypes.number,
      lazy: PropTypes.bool
    })
  }

  static defaultProps = {
    body: {},
    children: undefined,
    subscribe: {},
    render: undefined,
    url: undefined,
    fetch: undefined,
    options: {
      timeout: -1,
      refetchKey: undefined,
      lazy: false,
      params: {},
      method: "GET",
      headers: {}
    }
  }

  componentWillMount() {
    this.props.subscribe.onWillMount && this.props.subscribe.onWillMount()
    this._validateProps(this.props)
  }

  componentDidMount() {
    this.props.subscribe.onDidMount && this.props.subscribe.onDidMount()
    if (!this.props.options.lazy) {
      this._fetchData(this.props)
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    this._validateProps(nextProps)
  }

  componentWillUnmount() {
    this._isUnmounted = true
  }

  shouldComponentUpdate(nextProps: Props) {
    if (this.props.children !== nextProps.children) return true
    if (this.props.ooptions !== nextProps.options) return true
    if (this.props.render !== nextProps.render) return true
    if (this.props.subscribe !== nextProps.subscribe) return true
    return false
  }

  _fetchData = async (props: Props): Promise<void> => {
    const {
      body,
      subscribe,
      url = "",
      options,
      fetch
    } = props
    const { headers, method, timeout, params } = options
    const { onIntercept, onProgress, onTimeout } = subscribe
    try {
      this.setState({data: Data.loading()})

      let apiResponse
      if (fetch) {
        apiResponse = await fetch()
          .then(data => ({data}))
          .catch(error => ({error}))
      } else {
        apiResponse = await requestToApi({
          url,
          body: { ...body },
          headers,
          method,
          onTimeout,
          onProgress,
          onIntercept,
          params,
          timeout
        })
      }
      this._handleData({
        ...apiResponse
      })
    } catch (error) {
      this._handleData({
        error: {
          content: error,
          message: "Something went wrong during the request",
          url
        }
      })
      if (process.env.NODE_ENV !== "production") {
        invariant(
          !error,
          `<FetchData /> tried to call the route "${String(url)}" ` +
            `with "${String(method).toUpperCase()}" method ` +
            "but resolved with the following error: %s\n",
          this._printError(error)
        )
      }
    }
  }

  _handleData = (result: ReturnedData) : void => {
    if (!this._isUnmounted) {
      if (result.data) {
        this.setState({data: Data.success(result.data)})
        this.props.subscribe.onSuccess &&
          this.props.subscribe.onSuccess(result.data)
      } else if (result.error) {
        this.setState({data: Data.failure(result.error)})
        this.props.subscribe.onFailure &&
          this.props.subscribe.onFailure(result.error)
      }
    }
  }

  _printError = (error: ErrorContent): string =>
    error.response && JSON.stringify(error.response).length
      ? typeof error.response === "string"
        ? error.response
        : typeof error.response === "object"
          ? JSON.stringify(error.response, null, 2)
          : `${
              error.response
            }. Sorry <FetchData/> couldn't turned this into a readable string. ` +
            "Check error.content.request to see what happened."
      : error.request._response
        ? typeof error.request._response === "string"
          ? error.request._response
          : typeof error.request._response === "object"
            ? JSON.stringify(error.request._response, null, 2)
            : `${String(
                error.request._response
              )}. Sorry <FetchData /> couldn't turned this into a readable string. ` +
              "Check error.content.request to see what happened."
        : " .Sorry <FetchData /> couldn't turned this into a readable string. " +
          "Check error.content.request to see what happened."

  _validateProps = (props: Props) : void => {
    const { children, render, subscribe, url, options, fetch } = props
    const {timeout} = options

    invariant(url || fetch, "You must either provide a `url` or a `fetch` " +
     "function to <FetchDataData />")

    if (subscribe.onTimeout) {
      invariant(
        (typeof timeout === "number" && timeout >= 0),
        "You must provide a `timeout` number in ms to <FetchDataData /> or " +
          "<FetchProvider> in order to use `onTimeout`"
      )
    }

    invariant(
      children || render,
      "You must provide at least one of the following " +
        "to <FetchData />: children, `render`"
    )
  }

  run = () => {
    this._fetchData(this.props)
  }

  render() {
    const { children, render } = this.props
    const { data } = this.state
    const componentProps = { data, run: this.run }

    if (!this._isUnmounted) {

      if (typeof render === "function") return render(componentProps)

      if (typeof children === "function") return children(componentProps)
    }

    return null
  }
}

export default FetchData
