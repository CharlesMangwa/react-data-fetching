/* @flow */

import { Children, Component } from 'react'
import PropTypes from 'prop-types'
import invariant from 'invariant'

import { type ProviderProps, type Store, storeShape } from './types'

const createConnectedFetch = (): Class<*> => {
  class ConnectedFetch extends Component<ProviderProps> {
    rdfApi: string = this.props.api
    rdfHeaders: ?Object = this.props.headers
    rdfStore: ?Store = this.props.store
      ? this.context.store && this.context.store.getState()
      : this.props.store

    static defaultProps = {
      api: undefined,
      headers: {},
      store: undefined,
    }

    static propTypes = {
      api: PropTypes.string,
      headers: PropTypes.object,
      children: PropTypes.element.isRequired,
      store: storeShape,
    }

    static contextTypes = {
      store: storeShape,
    }

    static childContextTypes = {
      rdfApi: PropTypes.string,
      rdfHeaders: PropTypes.object,
      rdfStore: PropTypes.object,
    }

    getChildContext() {
      return {
        rdfApi: this.rdfApi || '',
        rdfHeaders: this.rdfHeaders,
        rdfStore: this.rdfStore,
      }
    }

    componentWillReceiveProps = (): null => null

    render() {
      return Children.only(this.props.children)
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    ConnectedFetch.prototype.componentWillReceiveProps = (
      nextProps: ProviderProps,
    ): void => {
      invariant(
        this.rdfApi === nextProps.api,
        '<ConnectedFetch> does not support changing `api` on the fly.',
      )
      invariant(
        this.rdfHeaders === nextProps.headers,
        '<ConnectedFetch> does not support changing `headers` on the fly.',
      )
      invariant(
        this.rdfStore === nextProps.store,
        '<ConnectedFetch> does not support changing `store` on the fly.',
      )
    }
  }

  return ConnectedFetch
}

export default createConnectedFetch()
