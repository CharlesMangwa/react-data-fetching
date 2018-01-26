/* @flow */
/* eslint react/no-typos: 0 */
/* eslint react/forbid-prop-types: 0 */

import { Children, Component } from 'react'
import PropTypes from 'prop-types'
import invariant from 'invariant'

import { type ProviderProps, type Store, storeShape } from './types'

export const createConnectedFetch = (): Class<*> => {
  class ConnectedFetch extends Component<ProviderProps> {
    rdfApi: string
    rdfHeaders: ?Object
    rdfStore: ?Store
    static defaultProps = { headers: {}, store: undefined }

    constructor(props: ProviderProps, context: any) {
      super(props, context)
      this.rdfApi = props.api
      this.rdfHeaders = props.headers
      this.rdfStore = props.store || context.store
    }

    getChildContext() {
      return {
        rdfApi: this.rdfApi || '',
        rdfHeaders: this.rdfHeaders,
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

  ConnectedFetch.propTypes = {
    api: PropTypes.string.isRequired,
    headers: PropTypes.object,
    children: PropTypes.element.isRequired,
    store: storeShape,
  }

  ConnectedFetch.childContextTypes = {
    rdfApi: PropTypes.string.isRequired,
    rdfHeaders: PropTypes.object.isRequired,
    rdfStore: storeShape.isRequired,
  }

  return ConnectedFetch
}

export default createConnectedFetch()
