// Copyright (c) 2025 NTT InfraNet
// @flow
import type { VisTimeline, TimelineData } from 'plugins/data/reducer'

// Type definitions
export type DataSetTimelineShowDataAction = {
  type: 'DATA_SET_TIMELINE_SHOW_DATA',
  payload: { timelineDataList: Array<TimelineData>, isShow: boolean }
}
export type DataSetVisTimelineAction = {
  type: 'DATA_SET_VIS_TIMELINE',
  payload: { visTimeline: VisTimeline }
}
export type DataRemoveVisTimelineAction = {
  type: 'DATA_REMOVE_VIS_TIMELINE',
  payload: { visTimelineInstance: any }
}
export type DataRemoveTimelineShowDataAction = {
  type: 'DATA_REMOVE_TIMELINE_SHOW_DATA'
}

export type DataTimelineAction =
  | DataSetTimelineShowDataAction
  | DataSetVisTimelineAction
  | DataRemoveVisTimelineAction
  | DataRemoveTimelineShowDataAction

// Action types
export const DATA_SET_TIMELINE_SHOW_DATA = 'DATA_SET_TIMELINE_SHOW_DATA'
export const DATA_SET_VIS_TIMELINE = 'DATA_SET_VIS_TIMELINE'
export const DATA_REMOVE_VIS_TIMELINE = 'DATA_REMOVE_VIS_TIMELINE'
export const DATA_REMOVE_TIMELINE_SHOW_DATA = 'DATA_REMOVE_TIMELINE_SHOW_DATA'

// Action creators
export const setTimelineShowData = (
  timelineDataList: Array<TimelineData>,
  isShow: boolean
) => ({
  type: DATA_SET_TIMELINE_SHOW_DATA,
  payload: {
    timelineDataList,
    isShow
  }
})
export const setVisTimeline = (visTimeline: VisTimeline) => ({
  type: DATA_SET_VIS_TIMELINE,
  payload: { visTimeline }
})
export const removeVisTimeline = (visTimelineInstance: any) => ({
  type: DATA_REMOVE_VIS_TIMELINE,
  payload: { visTimelineInstance }
})
export const removeTimelineShowData = () => ({
  type: DATA_REMOVE_TIMELINE_SHOW_DATA
})
