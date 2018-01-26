/* @flow */
/* eslint react/no-typos: 0 */

import { Children, Component } from 'react'
import PropTypes from 'prop-types'
import invariant from 'invariant'

import { type ProviderProps, type Store, storeShape } from './types'

export const createFetchProvider = (): Class<*> => {
  class FetchProvider extends Component<ProviderProps> {
    rdfApi: string
    rdfStore: Store

    constructor(props: ProviderProps, context: any) {
      super(props, context)
      this.rdfApi = props.api
      this.rdfStore = props.store
    }

    getChildContext() {
      return {
        rdfApi: this.rdfApi,
        rdfStore: this.rdfStore && this.rdfStore.getState(),
      }
    }

    componentWillReceiveProps = (): null => null

    render() {
      return Children.only(this.props.children)
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    FetchProvider.prototype.componentWillReceiveProps = (
      nextProps: ProviderProps,
    ): void => {
      invariant(
        this.api === nextProps.api,
        '<FetchProvider> does not support changing `api` on the fly.',
      )
      invariant(
        this.store === nextProps.store,
        '<FetchProvider> does not support changing `store` on the fly.',
      )
    }
  }

  FetchProvider.propTypes = {
    api: PropTypes.string.isRequired,
    store: storeShape.isRequired,
    children: PropTypes.element.isRequired,
  }

  FetchProvider.childContextTypes = {
    rdfApi: PropTypes.string.isRequired,
    rdfStore: storeShape.isRequired,
  }

  return FetchProvider
}

export default createFetchProvider()
