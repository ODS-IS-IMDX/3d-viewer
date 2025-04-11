// Copyright (c) 2025 NTT InfraNet
// @flow

// Types

export type EntityState<ID, T> = {|
  id: ?ID,
  data: ?$ReadOnly<T>,
  isLoading: boolean
|}

export type EntityListState<T> = $ReadOnly<{|
  items: $ReadOnlyArray<$ReadOnly<T>>,
  isLoading: boolean,
  isError: boolean
|}>

export type EntityAction<ID, T> = {|
  type: string,
  payload: {
    id?: ID,
    data?: $ReadOnly<T>,
    error?: Error
  }
|}

export type EntityListAction<T> = {|
  type: string,
  payload: {
    list?: $ReadOnlyArray<$ReadOnly<T>>,
    error?: Error
  }
|}

export type EntityReducer<ID, T> = (
  state: EntityState<ID, T>,
  action: EntityAction<ID, T>
) => EntityState<ID, T>
export type EntityListReducer<T> = (
  state: EntityListState<T>,
  action: EntityListAction<T>
) => EntityListState<T>
export type AdditionalReducers<T> = {
  string: (T, any) => T
}

// reducer creators

export function createEntityReducer<ID, T> (
  loadAction: string,
  loadErrorAction: string,
  loadSuccessAction: string,
  initialState?: EntityState<ID, T> = {
    id: undefined,
    data: undefined,
    isLoading: false
  },
  additionalReducers: AdditionalReducers<T> = {}
): EntityReducer<ID, T> {
  return function reducer (
    state: EntityState<ID, T> = initialState,
    action: EntityAction<ID, T>
  ): EntityState<ID, T> {
    if (Object.keys(additionalReducers).includes(action.type)) {
      return additionalReducers[action.type](state, action)
    }

    switch (action.type) {
      case loadAction:
        return { ...state, isLoading: true, id: action.payload.id }
      case loadErrorAction:
        return { ...state, isLoading: false, data: undefined }
      case loadSuccessAction:
        return { ...state, isLoading: false, data: action.payload.data }
      default:
        return state
    }
  }
}

export function createListReducer<T> (
  loadListAction: string,
  loadListErrorAction: string,
  loadListSuccesAction: string,
  initialState?: EntityListState<T> = {
    items: [],
    isLoading: false,
    isError: false
  },
  additionalReducers: AdditionalReducers<T> = {}
): EntityListReducer<T> {
  return function listReducer (
    state: EntityListState<T> = initialState,
    action: EntityListAction<T>
  ) {
    if (Object.keys(additionalReducers).includes(action.type)) {
      return additionalReducers[action.type](state, action)
    }

    switch (action.type) {
      case loadListAction:
        return { ...state, items: [], isLoading: true, isError: false }
      case loadListErrorAction:
        return { ...state, items: [], isLoading: false, isError: true }
      case loadListSuccesAction:
        return {
          ...state,
          items: action.payload.list,
          isLoading: false,
          isError: false
        }
      default:
        return state
    }
  }
}
