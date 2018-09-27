// @flow

import {
  type DataState,
  type DataHandler,
  type DataType,
} from './types'

export const state : DataState = {
  INIT: 'INIT',
  LOADING: 'LOADING',
  FAILURE: 'FAILURE',
  SUCCESS: 'SUCCESS'
}

const noop : void => void = () => {}

const create = (type : string, data: any) : DataHandler => {
  return {
    type,
    data,
    cata: definitions => {
      const fn = definitions[type] || noop
      return fn(data)
    },
  }
}

const Data : DataType = {
  init: () => create(state.INIT),
  loading: () => create(state.LOADING),
  failure: (error) => create(state.FAILURE, error),
  success: (data) => create(state.SUCCESS, data),
}

export default Data
