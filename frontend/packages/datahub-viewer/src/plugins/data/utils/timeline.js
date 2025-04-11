// Copyright (c) 2025 NTT InfraNet
// @flow
import { TIMELINE_ITEMS_LOCAL_STORAGE_KEY } from 'plugins/data/constants'

import type { Asset } from 'plugins/asset/reducer'
import type { TimelineData } from 'plugins/data/reducer'
/**
 * ローカルストレージに保持しているタイムライン表示アイテムから該当現場の初期タイムライン表示アイテムを選択
 * @param {Array<Annotation> | Array<Asset> | Array<ImageData> |Array<VideoData>} dataList
 * @returns {Array<TimelineData>}
 */
export const filterLocalStorageTimelineItem = (
  dataList: Array<Asset>
): Array<TimelineData> => {
  const localStorageTimelineDataMap = localStorage.getItem(
    TIMELINE_ITEMS_LOCAL_STORAGE_KEY
  ) // $FlowFixMe: localStorage.getItem(TIMELINE_ITEMS_LOCAL_STORAGE_KEY)は null/undefined の可能性がないため、エラー抑制
    ? JSON.parse(localStorage.getItem(TIMELINE_ITEMS_LOCAL_STORAGE_KEY))
    : {}
  // $FlowFixMe: ここに使っているのは共通プロパティ(id)のため、エラー抑制
  return dataList
    .filter(
      data =>
        localStorageTimelineDataMap[data.id] &&
        data.startDateTime &&
        data.endDateTime
    )
    .map(data => ({
      ...localStorageTimelineDataMap[data.id],
      displayName: data.displayName || data.name,
      startDateTime: data.startDateTime,
      endDateTime: data.endDateTime
    }))
}
