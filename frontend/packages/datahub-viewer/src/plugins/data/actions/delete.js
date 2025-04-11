// Copyright (c) 2025 NTT InfraNet
// @flow
import type { DeleteItem } from '../types'

export type DataSetDeleteItemAction = {
  type: 'DATA_DELETE_SET_ITEM',
  payload: {
    deleteItem: DeleteItem
  }
}
export type DataDeleteFileAction = {
  type: 'DATA_DELETE_FILE',
  payload: {
    treeItems: any
  }
}
export type DataDeleteSetLoadingAction = {
  type: 'DATA_DELETE_SET_LOADING',
  payload: {
    isLoading: boolean
  }
}

export type DataDeleteAction =
  | DataSetDeleteItemAction
  | DataDeleteFileAction
  | DataDeleteSetLoadingAction

// Action types
export const DATA_DELETE_SET_ITEM = 'DATA_DELETE_SET_ITEM'
export const DATA_DELETE_FILE = 'DATA_DELETE_FILE'
export const DATA_DELETE_SET_LOADING = 'DATA_DELETE_SET_LOADING'

// Action creators
export const setDeleteItem = (deleteItem: DeleteItem): DataDeleteAction => ({
  type: DATA_DELETE_SET_ITEM,
  payload: {
    deleteItem: deleteItem
  }
})

// Action creators
export const deleteFile = (treeItems: any): DataDeleteAction => ({
  type: DATA_DELETE_FILE,
  payload: {
    treeItems: treeItems
  }
})

// Action creators
export const setLoading = (isLoad: any): DataDeleteAction => ({
  type: DATA_DELETE_SET_LOADING,
  payload: {
    isLoading: isLoad.isLoading
  }
})
