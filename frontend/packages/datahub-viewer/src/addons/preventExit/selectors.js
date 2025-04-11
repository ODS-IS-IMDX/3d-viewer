// Copyright (c) 2025 NTT InfraNet
// @flow
import { createSelector } from 'reselect'

import type { PreventExitState } from './reducers'

type RootState = {
  preventExit: PreventExitState
}

const preventExitStateSelector = (state: RootState): PreventExitState =>
  state.preventExit

export const shouldPreventExit: RootState => boolean = createSelector(
  preventExitStateSelector,
  state => state.keys.length > 0
)
