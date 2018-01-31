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
  body: Object,
  method: Method,
  params: Object,
}

export type Props = {
  body?: Object,
  children?: (?Object) => React$Element<any>,
  headers?: Object,
  loader?: () => React$Element<any>,
  onError?: (?Object) => void,
  onLoad?: () => void,
  onSuccess?: (?Object) => void,
  method: Method,
  params?: Object,
  path: string,
  refetch?: boolean,
  render?: (?Object) => React$Element<any>,
  resultOnly?: boolean,
  url?: string,
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
export const methodShape = PropTypes.oneOf([
  'DELETE',
  'FORM_DATA',
  'GET',
  'HEAD',
  'PATCH',
  'POST',
  'PUT',
  'TRACE',
])

export const storeShape = PropTypes.shape({
  getState: PropTypes.func.isRequired,
})
