// import PropTypes from "prop-types";

import React from "react";

export type Interceptor = (interceptedData: IInterceptedData) => IRequestToApi | void;

export interface IContext {
  api?: string;
  headers?: {[s: string]: string};
  onIntercept?: Interceptor;
  loader?: React.ReactNode;
  store?: object;
  timeout?: number;
}

export interface IErrorContent {
  request: XMLHttpRequest;
  response: string | object;
}

export interface IError {
  content: IErrorContent;
  message: "Something went wrong during the request";
  url?: string;
}

export type Method =
  | "DELETE"
  | "FORM_DATA"
  | "GET"
  | "HEAD"
  | "PATCH"
  | "POST"
  | "PUT"
  | "TRACE";

export interface IReturnedData {
  data?: object;
  error?: IError;
  isOK?: boolean;
  request?: XMLHttpRequest;
  status?: number;
  store?: object;
}

export interface IDataFetcher {
  fetchData(): Promise<void>;
}

export interface IProps {
  body: {[s: string]: any};
  cancel?: boolean;
  children?: React.ReactNode;
  component?: React.ComponentType<IReturnedData | IError>;
  context: IContext;
  headers?: {[s: string]: string};
  loader?: React.ReactNode;
  method: Method;
  onError?: (data?: IReturnedData | IError) => void;
  onFetch?: (data?: IReturnedData | IError) => void;
  onIntercept?: Interceptor;
  onLoad?: () => void;
  onProgress?: (progressEvent: ProgressEvent) => void;
  onTimeout?: () => void;
  params?: {[s: string]: any};
  path?: string;
  refetchKey?: any;
  render?: React.SFC<IReturnedData | IError>;
  resultOnly?: boolean;
  timeout: number;
  url?: string;
}

export interface IRequestToApi {
  body?: {[s: string]: any};
  cancel?: boolean;
  headers?: {[s: string]: string};
  method: Method;
  onProgress?: (progressEvent: ProgressEvent) => void;
  onIntercept?: Interceptor;
  onTimeout?: () => void;
  params?: {[s: string]: any};
  url: string;
  timeout?: number;
}

export interface IInterceptedData {
  currentParams: IRequestToApi;
  request: XMLHttpRequest;
  status: number;
}

export interface IProviderProps {
  api: string;
  children: React.ReactNode;
  headers?: {[s: string]: string};
  loader?: React.ReactNode;
  onIntercept?: Interceptor;
  store?: object;
  timeout?: number;
}

/*
export const contextShape = PropTypes.shape({
  api: PropTypes.string,
  headers: PropTypes.object,
  loader: PropTypes.element,
  onIntercept: PropTypes.func,
  store: PropTypes.object,
  timeout: PropTypes.number,
});

export const methodShape = PropTypes.oneOf([
  "DELETE",
  "FORM_DATA",
  "GET",
  "HEAD",
  "PATCH",
  "POST",
  "PUT",
  "TRACE",
]);
*/
