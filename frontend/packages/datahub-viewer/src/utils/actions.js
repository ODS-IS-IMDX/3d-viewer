// Copyright (c) 2025 NTT InfraNet
// $flow

export type LoadListAction<T> = {
  type: T
}

export type LoadListErrorAction<T> = {
  type: T,
  payload: { error: Error }
}

export type LoadListSuccessAction<T> = {
  type: T,
  payload: { list: Array<Analytic> }
}

export function createLoadListActions<T> (
  loadListAction: string,
  loadListErrorAction: string,
  loadListSuccesAction: string
) {
  return {
    loadList: function loadList (): LoadListAction<loadListAction> {
      return {
        type: loadListAction
      }
    },

    loadListError: function loadListError (
      error: Error
    ): LoadListErrorAction<loadListErrorAction> {
      return {
        type: loadListErrorAction,
        payload: { error }
      }
    },

    loadListSuccess: function loadListSuccess (
      list: Array<T>
    ): LoadListSuccessAction<loadListSuccesAction> {
      return {
        type: loadListSuccesAction,
        payload: { list }
      }
    }
  }
}
