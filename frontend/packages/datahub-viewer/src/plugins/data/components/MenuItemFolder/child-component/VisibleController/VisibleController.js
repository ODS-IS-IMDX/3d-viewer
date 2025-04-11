// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import styled from 'styled-components'
import {
  IconStateVisibleThick,
  IconStateInvisibleThick,
  IconStateVisibleTimeline,
  IconStateInvisibleTimeline
} from '@ehv/datahub-icons'
import { stopPropagation } from 'utils/events'
import {
  FILE_TYPE,
  TIMELINE_MARKER_ID as MARKER_ID
} from 'plugins/data/constants'

import type { AssetID, Asset } from 'plugins/asset/reducer'
import { CESIUM_ION_TYPES } from 'plugins/asset/constants'
import type { VisTimeline, TimelineData } from 'plugins/data/reducer'

const FOLDER_ICON_STATUS = {
  INVISIBLE: 0,
  VISIBLE: 1,
  TIMELINE: 2
}

const IconWrapper = styled.div`
  display: block;
  width: 30px;
  height: 15px;
  text-align: center;
  line-height: 0;
`

const iconStyle = (isMobile: boolean) => ({
  width: isMobile ? '18px' : '15px',
  height: isMobile ? '18px' : '15px',
  verticalAlign: 'middle'
})

const styledIcon = Icon => styled(Icon)`
  & path:not(:first-child),
  circle {
    ${({ color }) => color && `fill: ${color};`}
  }
`

type VisibleControllerProps = {|
  assetList: Array<Asset>,
  isTimelineOpen: boolean,
  inTimelineDataList: Array<TimelineData>,
  visTimeline: VisTimeline,
  isMobile: boolean,
  setAssetVisibilityFunctionList: Array<
    (id: AssetID, isVisible: boolean) => void
  >,
  setTimelineShowData: (
    timelineDataList: Array<TimelineData>,
    isShow: boolean
  ) => void,
  element: any
|}

const getLeafNodeList = elementList =>
  elementList
    .map(element =>
      element.isDirectory ? getLeafNodeList(element.children) : element
    )
    .flat()

const Controller = (props: VisibleControllerProps) => {
  const {
    assetList,
    isTimelineOpen,
    inTimelineDataList,
    visTimeline,
    isMobile,
    setAssetVisibilityFunctionList,
    setTimelineShowData,
    element
  } = props

  if (!element || !element.children || element.children.length === 0) {
    return null
  }

  let isVisible = true
  let isTimelineVisible = null
  let terrainCount = 0
  let hasTimelineItem = false

  const leafNodeList = getLeafNodeList(element.children)

  leafNodeList.forEach(node => {
    const dataItem = assetList.find(asset => asset.id === node.referenceId)

    if (!dataItem) {
      return
    }
    if (dataItem && dataItem.ionAssetType === CESIUM_ION_TYPES.TERRAIN) {
      terrainCount++
      return
    }

    const isInTimeline = inTimelineDataList
      .map(data => data.id)
      .includes(dataItem.id)

    if (!dataItem.isDisplay) {
      isVisible = false
    }
    if (isTimelineOpen && isInTimeline) {
      isTimelineVisible = isVisible
    }

    const isTimelineItemFileType = [FILE_TYPE.ASSET].includes(node.fileType)
    if (
      isTimelineItemFileType &&
      dataItem.startDateTime &&
      dataItem.endDateTime
    ) {
      hasTimelineItem = true
    }
  })

  // 地形データと子要素の数が同じ場合は非表示とする
  if (terrainCount === leafNodeList.length) {
    isVisible = false
  }

  // folderIconStatus: 0=>非表示, 1=>表示 , 2=>タイムライン
  const folderIconStatusNow = isTimelineVisible !== null ? 2 : isVisible ? 1 : 0
  const folderIconStatusNext =
    isTimelineOpen && hasTimelineItem
      ? (folderIconStatusNow + 1) % 3
      : (folderIconStatusNow + 1) % 2

  const setFolderVisibility = () => {
    leafNodeList.forEach(node => {
      const dataItem = assetList.find(
        asset =>
          asset.id === node.referenceId &&
          asset.ionAssetType !== CESIUM_ION_TYPES.TERRAIN
      )

      if (!dataItem) {
        return
      }

      const hasDateTime = dataItem.startDateTime && dataItem.endDateTime
      switch (node.fileType) {
        case FILE_TYPE.ASSET:
          const { subFileType } = node
          const { id } = dataItem
          switch (folderIconStatusNext) {
            case FOLDER_ICON_STATUS.INVISIBLE:
              setAssetVisibilityFunctionList[subFileType](id, false)
              hasDateTime &&
                setTimelineShowData(
                  [
                    {
                      id: dataItem.id,
                      displayName: dataItem.displayName,
                      fileType: FILE_TYPE.ASSET,
                      subFileType,
                      startDateTime: dataItem.startDateTime,
                      endDateTime: dataItem.endDateTime,
                      isVisible: dataItem.isDisplay
                    }
                  ],
                  false
                )
              break
            case FOLDER_ICON_STATUS.VISIBLE:
              setAssetVisibilityFunctionList[subFileType](id, true)
              break
            case FOLDER_ICON_STATUS.TIMELINE:
              if (hasDateTime) {
                setTimelineShowData(
                  [
                    {
                      id: dataItem.id,
                      displayName: dataItem.displayName,
                      fileType: FILE_TYPE.ASSET,
                      subFileType,
                      startDateTime: dataItem.startDateTime,
                      endDateTime: dataItem.endDateTime,
                      isVisible: dataItem.isDisplay
                    }
                  ],
                  true
                )
                const timelineTime = visTimeline.visTimelineInstance.getCustomTime(
                  MARKER_ID
                )
                const isShouldVisible =
                  !dataItem.startDateTime ||
                  !dataItem.endDateTime ||
                  (new Date(dataItem.startDateTime).getTime() <= timelineTime &&
                    timelineTime <= new Date(dataItem.endDateTime).getTime())
                if (!isShouldVisible) {
                  setAssetVisibilityFunctionList[subFileType](id, false)
                  const assetDataInTimeline = visTimeline.visTimelineInstance.itemsData
                    .get()
                    .find(item => item.id === dataItem.id)
                  visTimeline.visTimelineInstance.itemsData.update({
                    ...assetDataInTimeline,
                    isDisplay: false
                  })
                }
              }
              break
            default:
              break
          }
          break
        default:
          break
      }
    })
  }

  const visibleIconColor = isVisible ? '#3a4248' : '#8e96a0'
  const timelineVisibleIconColor = isTimelineVisible ? '#3a4248' : '#8e96a0'
  const VisibleIcon = styledIcon(
    isTimelineVisible !== null && isTimelineOpen
      ? isTimelineVisible
        ? IconStateVisibleTimeline
        : IconStateInvisibleTimeline
      : isVisible
      ? IconStateVisibleThick
      : IconStateInvisibleThick
  )

  return (
    <IconWrapper onClick={stopPropagation(setFolderVisibility)}>
      {isTimelineVisible !== null && isTimelineOpen ? (
        <VisibleIcon
          style={{ verticalAlign: 'middle' }}
          color={timelineVisibleIconColor}
        />
      ) : (
        <VisibleIcon style={iconStyle(isMobile)} color={visibleIconColor} />
      )}
    </IconWrapper>
  )
}

export const VisibleController = React.memo<VisibleControllerProps>(Controller)
