/* @flow */

import { Children, Component } from 'react'
import PropTypes from 'prop-types'
import invariant from 'invariant'

import {
  type Interceptor,
  type ProviderProps,
  type Store,
  storeShape,
} from './types'

const createFetchProvider = (): Class<*> => {
  class FetchProvider extends Component<ProviderProps> {
    rdfApi = this.props.api

    rdfHeaders: ?Object = this.props.headers

    rdfInterceptor: ?Interceptor = this.props.onIntercept

    rdfLoader: ?React$Node = this.props.loader

    rdfStore: ?Store =
      this.context && this.context.store
        ? this.context.store.getState()
        : this.props.store

    rdfTimeout: ?number = this.props.timeout

    static defaultProps = {
      api: undefined,
      headers: {},
      loader: undefined,
      onIntercept: undefined,
      store: undefined,
      timeout: undefined,
    }

    static propTypes = {
      api: PropTypes.string,
      children: PropTypes.element.isRequired,
      headers: PropTypes.object,
      loader: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
      onIntercept: PropTypes.func,
      store: storeShape,
      timeout: PropTypes.number,
    }

    static contextTypes = {
      store: storeShape,
    }

    static childContextTypes = {
      rdfApi: PropTypes.string,
      rdfHeaders: PropTypes.object,
      rdfInterceptor: PropTypes.func,
      rdfLoader: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
      rdfStore: PropTypes.object,
      rdfTimeout: PropTypes.number,
    }

    getChildContext() {
      return {
        rdfApi: this.rdfApi || '',
        rdfHeaders: this.rdfHeaders,
        rdfInterceptor: this.rdfInterceptor,
        rdfLoader: this.rdfLoader,
        rdfStore: this.props.store || this.rdfStore,
        rdfTimeout: this.rdfTimeout,
      }
    }

    componentDidUpdate = (): null => null

    render() {
      return Children.only(this.props.children)
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    FetchProvider.prototype.componentDidUpdate = (
      nextProps: ProviderProps
    ): void => {
      invariant(
        this.rdfApi === nextProps.api,
        '<FetchProvider> does not support changing `api` on the fly.'
      )
      invariant(
        this.rdfHeaders === nextProps.headers,
        '<FetchProvider> does not support changing `headers` on the fly.'
      )
      invariant(
        this.rdfLoader === nextProps.loader,
        '<FetchProvider> does not support changing `loader` on the fly.'
      )
      invariant(
        this.rdfInterceptor === nextProps.onIntercept,
        '<FetchProvider> does not support changing `onIntercept` on the fly.'
      )
      invariant(
        this.rdfStore === nextProps.store,
        '<FetchProvider> does not support changing `store` on the fly.'
      )
      invariant(
        this.rdfTimeout === nextProps.timeout,
        '<FetchProvider> does not support changing `timeout` on the fly.'
      )
    }
  }

  return FetchProvider
}

export default createFetchProvider()
