/* @flow */
/* eslint no-return-assign: 0 */

import type { RequestToApi } from './types'

const requestToApi = (args: RequestToApi): Promise<any> => {
  const {
    body,
    headers,
    method,
    onProgress = () => null,
    onTimeout,
    params,
    onIntercept,
    url,
    timeout = 0,
  } = args
  const defaultHeaders = {
    Accept: 'application/json;charset=UTF-8',
    'Content-Type':
      method === 'FORM_DATA' ? 'multipart/form-data' : 'application/json',
  }
  const formData = new FormData()
  let route = url
  let interceptedResult = null

  const handleError = async (
    error: Event | XMLHttpRequest,
    request: XMLHttpRequest,
    reject: Function
  ): Promise<void> => {
    reject({
      response: request.response,
      request,
    })
  }

  const handleTimeout = (request: XMLHttpRequest, reject: Function): void => {
    request.abort()
    if (onTimeout) onTimeout()
    reject(`Your request took more than ${timeout}ms to resolve.`)
  }

  const returnData = async (
    request: XMLHttpRequest,
    resolve: Function,
    reject: Function
  ): Promise<void> => {
    if (request.readyState === 4) {
      const isOK = request.status >= 200 && request.status <= 299
      if (isOK) {
        let data
        try {
          if (request.responseText) data = JSON.parse(request.responseText)
        } catch (err) {
          data = request.responseText
        }
        const response = {
          data,
          isOK,
          request,
          status: request.status,
        }
        resolve(response)
      } else if (onIntercept) {
        interceptedResult = onIntercept({
          currentParams: args,
          request,
          status: request.status,
        })
        if (interceptedResult) {
          resolve(
            requestToApi({
              ...interceptedResult,
              onIntercept: undefined,
            })
          )
        } else handleError(request, request, reject)
      } else handleError(request, request, reject)
    }
  }

  const setHeaders = (request: XMLHttpRequest): void => {
    Object.entries(defaultHeaders).map(defaultHeader =>
      request.setRequestHeader(defaultHeader[0], String(defaultHeader[1]))
    )
    if (headers && Object.keys(headers).length > 0) {
      Object.entries(headers).map(header =>
        request.setRequestHeader(header[0], String(header[1]))
      )
    }
  }

  if (method === 'FORM_DATA' && Object.entries(body).length > 0) {
    Object.entries(body).map(
      // $FlowFixMe
      entry => formData.append(entry[0], entry[1])
    )
  }

  if (params && Object.keys(params).length > 0) {
    Object.entries(params).map(
      (param, index) =>
        index === 0
          ? (route = `${route}?${param[0]}=${JSON.stringify(param[1])}`)
          : (route = `${route}&${param[0]}=${JSON.stringify(param[1])}`)
    )
  }

  const sendRequest = () =>
    new Promise((resolve, reject) => {
      try {
        const request = new XMLHttpRequest()
        if (request.upload) {
          request.upload.onerror = error => handleError(error, request, resolve)
          request.upload.onload = () => returnData(request, resolve, reject)
          request.upload.onprogress = onProgress
          request.upload.ontimeout = () => handleTimeout(request, reject)
        }

        request.onerror = error => handleError(error, request, resolve)
        request.onprogress = onProgress
        request.onreadystatechange = () => returnData(request, resolve, reject)
        request.ontimeout = () => handleTimeout(request, reject)

        request.open(method === 'FORM_DATA' ? 'POST' : method, route)
        request.timeout = timeout
        setHeaders(request)
        request.send(
          method === 'FORM_DATA'
            ? formData
            : method === 'DELETE' ||
              method === 'GET' ||
              method === 'HEAD' ||
              method === 'PUT'
              ? null
              : JSON.stringify({ ...body })
        )
      } catch (request) {
        handleError(request, request, reject)
      }
    })

  return sendRequest()
}

export default requestToApi
