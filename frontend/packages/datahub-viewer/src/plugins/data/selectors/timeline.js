// Copyright (c) 2025 NTT InfraNet
// @flow
import { createSelector } from 'reselect'

import type { RootState } from 'index'
import type { DataTimelineState } from '../reducer'

const dataTimelineStateSelector = (state: RootState): DataTimelineState =>
  state.data.timeline

// $FlowFixMe
export const getVisTimeline = createSelector(
  dataTimelineStateSelector,
  selector => (selector ? selector.visTimeline : null)
)
// $FlowFixMe
export const getInTimelineDataList = createSelector(
  dataTimelineStateSelector,
  selector => (selector ? selector.inTimelineDataList : [])
)
