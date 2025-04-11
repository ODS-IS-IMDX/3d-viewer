// Copyright (c) 2025 NTT InfraNet
// @flow
import {
  DATA_DELETE_SET_ITEM,
  DATA_DELETE_SET_LOADING,
  type DataDeleteAction
} from '../actions'
import type { DeleteItem } from '../types'

export type DataDeleteState = {
  deleteItem: DeleteItem,
  isLoading: boolean
}

const initialState = {
  deleteItem: {},
  isLoading: false
}

export const deleteItemReducer = (
  state: DataDeleteState = initialState,
  action: DataDeleteAction
): DataDeleteState => {
  let result: DataDeleteState = state
  switch (action.type) {
    case DATA_DELETE_SET_ITEM:
      result = {
        ...state,
        deleteItem: action.payload.deleteItem
      }
      break
    case DATA_DELETE_SET_LOADING:
      result = {
        ...state,
        isLoading: action.payload.isLoading
      }
      break
    default:
      break
  }
  return result
}
