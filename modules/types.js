/* @flow */

import PropTypes from 'prop-types'

// FLOW
export type Context = {
  rdfApi: string,
  rdfStore: Object,
}

export type Method =
  'DELETE'
  | 'FORM_DATA'
  | 'GET'
  | 'HEAD'
  | 'PATCH'
  | 'POST'
  | 'PUT'
  | 'TRACE'

export type DefaultProps = {
  params: {
    method: Method,
    body: Object,
  },
}

export type Props = {
  children?: (?Object) => React$Element<any>,
  headers?: Object,
  onError?: (Object) => React$Element<any> | (Object) => void,
  onLoad?: () => React$Element<any> | () => void,
  onFetch?: (?Object) => void | (?Object) => void,
  path: string,
  params?: Object,
  refetch?: boolean,
  render?: (?Object) => React$Element<any>,
  resultOnly?: boolean,
}

export type ReturnedData = {
  data?: Object,
  error?: Object | string,
  isOK?: boolean,
  response?: Object,
  status?: number,
  store?: Object,
}

export type Store = {
  subscribe: Function,
  dispatch: Function,
  getState: () => Object,
}

export type ProviderProps = {
  api: string,
  children: React$Element<any>,
  store: Store,
}

// PROPTYPES
export const paramsShape = PropTypes.shape({
  method: PropTypes.oneOf([
    'DELETE',
    'FORM_DATA',
    'GET',
    'HEAD',
    'PATCH',
    'POST',
    'PUT',
    'TRACE',
  ]),
  body: PropTypes.object,
})

export const storeShape = PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired,
})
