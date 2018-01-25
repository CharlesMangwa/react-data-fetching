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
  error: ?(Object) => React$Element<any>,
  loader: ?() => React$Element<any>,
  params: {
    method: Method,
    body: Object,
  },
  refetch: boolean,
  resultOnly: boolean,
}

export type Props = {
  children?: (?Object) => React$Element<any>,
  error?: (Object) => React$Element<any>,
  headers?: Object,
  loader?: () => React$Element<any>,
  onFetch?: (?Object) => void,
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
