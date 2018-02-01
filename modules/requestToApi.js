/* @flow */
/* eslint no-return-assign: 0 */

import type { Method } from './types'

const requestToApi = (
  path: string,
  method: Method,
  body: Object,
  headers?: Object,
  params?: Object,
): Promise<any> => {
  const formData = new FormData()
  let url = path

  if (method === 'FORM_DATA' && Object.entries(body).length) {
    Object.entries(body).map(
      // $FlowFixMe
      entry => formData.append(entry[0], entry[1]),
    )
  }

  if (params && Object.keys(params).length > 0) {
    Object.entries(params).map((param, index) => (
      index === 0
        ? url = `${url}?${param[0]}=${String(param[1])}`
        : url = `${url}&${param[0]}=${String(param[1])}`
    ))
  }

  return new Promise(async (resolve, reject) => {
    try {
      const request = await fetch(url, {
        method: method === 'FORM_DATA' ? 'POST' : method,
        headers: {
          Accept: 'application/json',
          'Cache-Control': 'no-cache',
          'Content-Type':
            method === 'FORM_DATA' ? 'multipart/form-data' : 'application/json',
          ...headers,
        },
        body:
          method === 'GET' || method === 'DELETE'
            ? undefined
            : method === 'FORM_DATA' ? formData : JSON.stringify({ ...body }),
      })
      const response = {
        isOK: request.ok,
        response: request,
        status: request.status,
        result: await request.json(),
      }
      resolve(response)
    }
    catch (errors) {
      reject(errors)
    }
  })
}

export default requestToApi
