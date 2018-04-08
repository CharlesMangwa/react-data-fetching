/* @flow */
/* eslint-disable no-use-before-define */

import PropTypes from 'prop-types'

// FLOW

export type Interceptor = (InterceptedData) => ?RequestToApi;
export type Context = {
  rdfApi: string,
  rdfHeaders: Object,
  rdfInterceptor: ?Interceptor,
  rdfLoader: React$Node,
  rdfStore: Object,
  rdfTimeout: number,
}

export type ErrorContent = {
  request: XMLHttpRequest,
  response: String | Object,
}

export type Error = {
  content: ErrorContent,
  message: 'Something went wrong during the request',
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

export type Progress = {
  bubbles: boolean,
  cancelable: boolean,
  lengthComputable: boolean,
  loaded: number,
  target: EventTarget,
  total: number,
  type: string,
}

export type ReturnedData = {
  data?: Object,
  error?: Error,
  isOK?: boolean,
  request?: XMLHttpRequest,
  status?: number,
  store?: Object,
}

export type Props = {
  body?: Object,
  children?: React$StatelessFunctionalComponent<?ReturnedData | Error>,
  component?: React$ComponentType<?ReturnedData | Error>,
  headers?: Object,
  loader?: React$Node,
  method: Method,
  onError?: (?ReturnedData | Error) => void,
  onFetch?: (?ReturnedData | Error) => void,
  onLoad?: Function,
  onProgress?: (Progress) => void,
  onTimeout?: Function,
  onIntercept?: Interceptor,
  params?: Object,
  path?: string,
  refetchKey?: any,
  render?: React$StatelessFunctionalComponent<?ReturnedData | Error>,
  resultOnly?: boolean,
  timeout?: number,
  url?: string,
}

export type RequestToApi = {
  body?: Object,
  headers?: Object,
  method: Method,
  onProgress?: (Progress) => void,
  onTimeout?: Function,
  onIntercept?: ?Interceptor,
  params?: Object,
  url: string,
  timeout?: number,
}

export type InterceptedData = {
  currentParams: RequestToApi,
  request: XMLHttpRequest,
  status: number
}

export type Store = {
  subscribe: Function,
  dispatch: Function,
  getState: () => Object,
}

export type ProviderProps = {
  api: string,
  children: React$Node,
  headers?: Object,
  loader?: React$Node,
  onIntercept?: Interceptor,
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
