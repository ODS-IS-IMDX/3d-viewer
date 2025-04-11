// Copyright (c) 2025 NTT InfraNet
// @flow
import { createSelector } from 'reselect'

import type { RootState } from 'index'
import type { DataDeleteState } from '../reducer/delete'

const dataMetaStateSelector = (state: RootState): DataDeleteState =>
  state.data.delete

// $FlowFixMe
export const getDeleteItem = createSelector(
  dataMetaStateSelector,
  selector => selector.deleteItem
)

// $FlowFixMe
export const getIsLoading = createSelector(
  dataMetaStateSelector,
  selector => selector.isLoading
)
