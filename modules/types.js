/* @flow */

import PropTypes from 'prop-types'

// FLOW
export type Context = {
  rdfApi: string,
  rdfHeaders: Object,
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
  loader?: () => React$Element<any>,
  onError?: (Object) => void,
  onLoad?: Function,
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
  headers?: Object,
  store?: Store,
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
  getState: PropTypes.func.isRequired,
})
