/* @flow */
/* eslint react/no-typos: 0 */

import { Children, Component } from 'react'
import PropTypes from 'prop-types'
import invariant from 'invariant'

import { type ProviderProps, type Store, storeShape } from './types'

export const createConnectedFetch = (): Class<*> => {
  class ConnectedFetch extends Component<ProviderProps> {
    rdfApi: string
    rdfStore: ?Store
    static defaultProps = { store: undefined }

    constructor(props: ProviderProps, context: any) {
      super(props, context)
      this.rdfApi = props.api
      this.rdfStore = context.store || props.store
    }

    getChildContext() {
      return {
        rdfApi: this.rdfApi || '',
        rdfStore: this.rdfStore && this.rdfStore.getState(),
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
        this.api === nextProps.api,
        '<ConnectedFetch> does not support changing `api` on the fly.',
      )
      invariant(
        this.store === nextProps.store,
        '<ConnectedFetch> does not support changing `store` on the fly.',
      )
    }
  }

  ConnectedFetch.propTypes = {
    api: PropTypes.string.isRequired,
    store: storeShape,
    children: PropTypes.element.isRequired,
  }

  ConnectedFetch.childContextTypes = {
    rdfApi: PropTypes.string.isRequired,
    rdfStore: storeShape.isRequired,
  }

  return ConnectedFetch
}

export default createConnectedFetch()
