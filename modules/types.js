/* @flow */
/* eslint-disable no-use-before-define */

import PropTypes from 'prop-types'

// FLOW

export type Interceptor = InterceptedData => ?RequestToApi

export type Context = {|
  api: ?string,
  headers: Object,
  onIntercept: ?Interceptor,
  loader: ?React$Node,
  store: ?Object,
  timeout: ?number,
|}

export type ErrorContent = {|
  request: XMLHttpRequest,
  response: String | Object,
|}

export type Error = {|
  content: ErrorContent,
  message: 'Something went wrong during the request',
  url?: string,
|}

export type Method =
  | 'DELETE'
  | 'FORM_DATA'
  | 'GET'
  | 'HEAD'
  | 'PATCH'
  | 'POST'
  | 'PUT'
  | 'TRACE'

export type ReturnedData = {|
  data?: ?Object,
  error?: Error,
  isOK?: boolean,
  request?: XMLHttpRequest,
  status?: number,
  store?: ?Object,
|}

export type Props = {|
  body?: Object,
  cancel?: boolean,
  children?: React$StatelessFunctionalComponent<?ReturnedData | Error>,
  component?: React$ComponentType<?ReturnedData | Error>,
  context: Context,
  headers?: Object,
  loader?: React$Node,
  method: Method,
  onError?: (?ReturnedData | Error) => void,
  onFetch?: (?ReturnedData | Error) => void,
  onIntercept?: Interceptor,
  onLoad?: Function,
  onProgress?: ProgressEvent => void,
  onTimeout?: Function,
  params?: Object,
  path?: string,
  refetchKey?: any,
  render?: React$StatelessFunctionalComponent<?ReturnedData | Error>,
  resultOnly?: boolean,
  timeout?: number,
  url?: string,
|}

export type RequestToApi = {|
  body?: Object,
  cancel?: boolean,
  headers?: Object,
  method: Method,
  onProgress?: ProgressEvent => void,
  onIntercept?: ?Interceptor,
  onTimeout?: Function,
  params?: Object,
  url: string,
  timeout?: number,
|}

export type InterceptedData = {|
  currentParams: RequestToApi,
  request: XMLHttpRequest,
  status: number,
|}

export type ProviderProps = {|
  api: string,
  children: React$Node,
  headers?: Object,
  loader?: React$Node,
  onIntercept?: Interceptor,
  store?: Object,
  timeout?: number,
|}

// PROPTYPES

export const contextShape = PropTypes.shape({
  api: PropTypes.string,
  headers: PropTypes.object,
  onIntercept: PropTypes.func,
  loader: PropTypes.element,
  store: PropTypes.object,
  timeout: PropTypes.number,
})

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
