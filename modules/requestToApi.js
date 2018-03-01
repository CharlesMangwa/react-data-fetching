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

  const returnData = async (
    request: XMLHttpRequest,
    resolve: Function,
    isUpload?: boolean,
  ): Promise<void> => {
    if (request.readyState === 4 || isUpload) {
      const response = {
        data: await JSON.parse(request.responseText),
        isOK: request.status >= 200 && request.status <= 299,
        request,
        status: request.status,
      }
      resolve(response)
    }
  }

  const handleTimeout = (request: XMLHttpRequest, reject: Function): void => {
    request.abort()
    if (onTimeout) onTimeout()
    reject(`Your request took more than ${timeout}ms to resolve.`)
  }

  const setHeaders = (request: XMLHttpRequest): void => {
    Object.entries(defaultHeaders).map(defaultHeader =>
      request.setRequestHeader(defaultHeader[0], String(defaultHeader[1])))
    if (headers && Object.keys(headers).length > 0) {
      Object.entries(headers).map(header =>
        request.setRequestHeader(header[0], String(header[1])))
    }
  }

  if (method === 'FORM_DATA' && Object.entries(body).length > 0) {
    Object.entries(body).map(
      // $FlowFixMe
      entry => formData.append(entry[0], entry[1]))
  }

  if (params && Object.keys(params).length > 0) {
    Object.entries(params).map((param, index) => (
      index === 0
        ? (route = `${route}?${param[0]}=${String(param[1])}`)
        : (route = `${route}&${param[0]}=${String(param[1])}`)
    ))
  }

  return new Promise((resolve, reject) => {
    try {
      const request = new XMLHttpRequest()
      request.timeout = timeout
      request.withCredentials = true

      if (request.upload) {
        request.upload.onerror = e => reject(e)
        request.upload.onload = () => returnData(request, resolve, true)
        request.upload.onprogress = onProgress
        request.upload.ontimeout = () => handleTimeout(request, reject)
      }

      request.onerror = e => reject(e)
      request.onprogress = onProgress
      request.onreadystatechange = () => returnData(request, resolve)
      request.ontimeout = () => handleTimeout(request, reject)

      request.open(method === 'FORM_DATA' ? 'POST' : method, route)
      setHeaders(request)
      request.send(
        method === 'FORM_DATA'
          ? formData
          : method === 'GET' || method === 'DELETE'
            ? null
            : JSON.stringify({ ...body }))
    }
    catch (errors) {
      reject(errors)
    }
  })
}

export default requestToApi
