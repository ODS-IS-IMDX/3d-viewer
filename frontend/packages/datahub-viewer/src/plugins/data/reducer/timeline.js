// Copyright (c) 2025 NTT InfraNet
// @flow
import {
  DATA_SET_TIMELINE_SHOW_DATA,
  DATA_SET_VIS_TIMELINE,
  DATA_REMOVE_VIS_TIMELINE,
  DATA_REMOVE_TIMELINE_SHOW_DATA,
  type DataTimelineAction
} from '../actions'
import { TIMELINE_ITEMS_LOCAL_STORAGE_KEY } from 'plugins/data/constants'

export type TimelineData = {|
  id: AssetID,
  displayName: string,
  fileType: number,
  subFileType?: number,
  startDateTime: string,
  endDateTime: string,
  isVisible: boolean
|}

export type VisTimeline = {|
  visTimelineInstance: any
|}

export type DataTimelineState = {
  inTimelineDataList: Array<TimelineData>,
  visTimeline: VisTimeline | null
}

const initialState = {
  inTimelineDataList: [],
  visTimeline: null
}

export const timelineReducer = (
  state: DataTimelineState = initialState,
  action: DataTimelineAction
): DataTimelineState => {
  switch (action.type) {
    case DATA_SET_TIMELINE_SHOW_DATA: {
      const { timelineDataList, isShow } = action.payload
      const { inTimelineDataList } = state
      const inTimelineDataIdList = inTimelineDataList.map(data => data.id)
      // timelineに表示するデータを更新
      const newInTimelineDataList = isShow
        ? timelineDataList.reduce(
            (prev, current) => {
              if (inTimelineDataIdList.includes(current.id)) {
                // もしtimelineに追加したいアイテムが既に存在している場合は更新
                prev.forEach((data, index) => {
                  if (data.id === current.id) {
                    prev[index] = current
                  }
                })
              } else {
                // もしtimelineに追加したいアイテムが存在しない場合は追加
                // $FlowFixMe[infererror]: prevはundefinedの可能性がないため、エラー抑制
                prev.push(current)
              }
              return prev
            },
            [...inTimelineDataList]
          )
        : timelineDataList
        ? inTimelineDataList.filter(
            data => !timelineDataList.map(data => data.id).includes(data.id)
          )
        : inTimelineDataList

      // 各データをタイムラインに格納
      const { visTimeline } = state
      if (visTimeline) {
        const { visTimelineInstance } = visTimeline
        !visTimelineInstance.memorizedVisibleMap &&
          (visTimelineInstance.memorizedVisibleMap = new Map())
        // タイムラインに追加する前に現在の表示状態を記憶する
        // $FlowFixMe[infererror]: newInTimelineDataListはundefinedの可能性がないため、エラー抑制
        newInTimelineDataList.forEach(item => {
          const { memorizedVisibleMap } = visTimelineInstance
          !memorizedVisibleMap.has(item.id) &&
            memorizedVisibleMap.set(item.id, item.isVisible)
        })

        // タイムラインにアイテムをセット
        visTimelineInstance.setData({
          groups: newInTimelineDataList.map(item => ({
            id: item.id,
            content: item.displayName,
            style: `
              max-width: 200px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            `
          })),
          items: newInTimelineDataList.map(item => ({
            ...item,
            start: item.startDateTime
              ? item.startDateTime
              : new Date(0).toISOString(),
            end: item.endDateTime ? item.endDateTime : new Date().toISOString(),
            group: item.id,
            title: item.displayName,
            style: `
                border-radius: 2px;
              `
          }))
        })
      }

      // 現在timelineに表示するデータをlocalStorageに追加保存または更新
      const localStorageTimelineDataMap = localStorage.getItem(
        TIMELINE_ITEMS_LOCAL_STORAGE_KEY
      )
        ? JSON.parse(localStorage.getItem(TIMELINE_ITEMS_LOCAL_STORAGE_KEY))
        : {}
      if (timelineDataList && !isShow) {
        timelineDataList.forEach(data => {
          localStorageTimelineDataMap[data.id] = null
        })
        localStorage.setItem(
          TIMELINE_ITEMS_LOCAL_STORAGE_KEY,
          JSON.stringify(localStorageTimelineDataMap)
        )
      } else {
        localStorage.setItem(
          TIMELINE_ITEMS_LOCAL_STORAGE_KEY,
          JSON.stringify({
            ...localStorageTimelineDataMap,
            ...newInTimelineDataList.reduce((prev, current) => {
              prev[current.id] = current
              return prev
            }, {})
          })
        )
      }

      return { ...state, inTimelineDataList: newInTimelineDataList }
    }
    case DATA_SET_VIS_TIMELINE: {
      const { visTimeline } = action.payload
      return visTimeline ? { ...state, visTimeline } : state
    }
    case DATA_REMOVE_VIS_TIMELINE: {
      const { visTimelineInstance } = action.payload
      return state.visTimeline.visTimelineInstance === visTimelineInstance
        ? { ...state, visTimeline: undefined }
        : state
    }
    case DATA_REMOVE_TIMELINE_SHOW_DATA:
      return { ...state, inTimelineDataList: [] }
    default:
      return state
  }
}
