/* @flow */
/* eslint-disable no-use-before-define */

import PropTypes from 'prop-types'

// FLOW

export type Interceptor = InterceptedData => ?RequestToApi

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
  onIntercept?: Interceptor,
  onLoad?: Function,
  onProgress?: Progress => void,
  onTimeout?: Function,
  params?: Object,
  path?: string,
  refetch?: any,
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
  onProgress?: Progress => void,
  onIntercept?: ?Interceptor,
  onTimeout?: Function,
  params?: Object,
  url: string,
  timeout?: number,
}

export type InterceptedData = {
  currentParams: RequestToApi,
  request: XMLHttpRequest,
  status: number,
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

// FetchData specific

export type DataState = {
  INIT: string,
  LOADING: string,
  FAILURE: string,
  SUCCESS: string
}

export type DataCallback = {
  INIT?: Function,
  LOADING?: Function,
  FAILURE?: Function,
  SUCCESS?: Function,
}

export type DataHandler = {
  type: string,
  data: any,
  cata: DataCallback => React$Node
}

export type DataType = {
  init: void => DataHandler,
  loading: void => DataHandler,
  failure: any => DataHandler,
  success: any => DataHandler
}

export type FetchDataOptions = {
  headers?: Object,
  method: Method,
  refetchKey?: any,
  timeout?: number,
  lazy?: boolean,
  params: any
}

export type FetchDataSubscribe = {
  onWillMount?: Function,
  onDidMount?: Function,
  onSuccess?: Function,
  onFailure?: Function,
  onLoading?: Function,
  onProgress?: Function,
  onTimeout?: Function,
  onIntercept?: Function
}

export type FetchDataProps = {
  body?: Object,
  children?: React$StatelessFunctionalComponent<?ReturnedData | Error>,
  subscribe: FetchDataSubscribe,
  render?: React$StatelessFunctionalComponent<?ReturnedData | Error>,
  url?: string,
  options: FetchDataOptions,
  fetch?: Function
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
