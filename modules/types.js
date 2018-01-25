/* @flow */

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
  loaded: boolean,
  status?: boolean,
}
