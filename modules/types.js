/* @flow */

import PropTypes from 'prop-types'

// FLOW
export type Context = {
  rdfApi: string,
  rdfHeaders: Object,
  rdfStore: Object,
  rdfTimeout: number,
}

type Error = {
  content: {
    request: XMLHttpRequest,
    response: Object,
  },
  message: string,
  url?: string,
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

type Progress = {
  bubbles: boolean,
  cancelable: boolean,
  lengthComputable: boolean,
  loaded: number,
  target: EventTarget,
  total: number,
  type: string,
}

export type Props = {
  body?: Object,
  children?: (?Object) => React$Element<*>,
  headers?: Object,
  loader?: (void) => React$Element<*>,
  onError?: (?Object) => void,
  onLoad?: (void) => void,
  onProgress?: (Progress) => void,
  onSuccess?: (?Object) => void,
  onTimeout?: (void) => void,
  method: Method,
  params?: Object,
  path: string,
  refetch?: boolean,
  render?: (?Object) => React$Element<*>,
  resultOnly?: boolean,
  timeout?: number,
  url?: string,
}

export type ReturnedData = {
  data?: Object,
  error?: Error,
  isOK?: boolean,
  request?: XMLHttpRequest,
  status?: number,
  store?: Object,
}

export type RequestToApi = {
  body?: Object,
  headers?: Object,
  method: Method,
  onProgress?: (Progress) => void,
  onTimeout?: () => void,
  params?: Object,
  url: string,
  timeout?: number,
}

export type Store = {
  subscribe: () => void,
  dispatch: () => void,
  getState: () => Object,
}

export type ProviderProps = {
  api: string,
  children: React$Element<*>,
  headers?: Object,
  store?: Store,
  timeout?: number,
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
  getState: PropTypes.func,
})
