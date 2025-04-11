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
import {
  FILE_TYPE,
  TIMELINE_MARKER_ID as MARKER_ID
} from 'plugins/data/constants'

import type { AssetID, Asset } from 'plugins/asset/reducer'
import type { TimelineData, VisTimeline } from 'plugins/data/reducer'
import type { DataSetTimelineShowDataAction } from 'plugins/data/actions'

const IconWrapper = styled.div`
  display: block;
  width: 30px;
  height: 18px;
  text-align: center;
  line-height: 0;
`

const iconStyle = (isMobile: boolean) => ({
  width: isMobile ? '18px' : '15px',
  height: isMobile ? '18px' : '15px',
  verticalAlign: 'middle',
  textAlign: 'center'
})

const styledIcon = Icon => styled(Icon)`
  & path:not(:first-child),
  circle {
    ${({ color }) => color && `fill: ${color};`}
  }
`

type VisibleControllerProps = {|
  asset: Asset,
  subFileType: number,
  isDrawerOpen: boolean,
  inTimelineDataList: Array<TimelineData>,
  visTimeline: VisTimeline,
  isMobile: boolean,
  setVisibilityFunctionList: Array<(id: AssetID, isVisible: boolean) => void>,
  setTimelineShowData: (
    timelineDataList: Array<TimelineData>,
    isShow: boolean
  ) => DataSetTimelineShowDataAction
|}

const Controller = (props: VisibleControllerProps) => {
  const {
    asset,
    subFileType,
    isDrawerOpen,
    inTimelineDataList,
    visTimeline,
    isMobile,
    setVisibilityFunctionList,
    setTimelineShowData
  } = props
  const { id, displayName, startDateTime, endDateTime, isDisplay } = asset
  const isInTimeline = inTimelineDataList.map(data => data.id).includes(id)

  const IconVisible = isDisplay
    ? IconStateVisibleThick
    : IconStateInvisibleThick
  const IconVisibleTimeline = isDisplay
    ? IconStateVisibleTimeline
    : IconStateInvisibleTimeline

  const hasDateTime = startDateTime && endDateTime
  // アセットの表示切替
  const setAssetVisibility = event => {
    event.stopPropagation()
    // タイムラインドロア非表示時: 表示 / 非表示 を切り替え
    if (!isDrawerOpen || !hasDateTime) {
      setVisibilityFunctionList[subFileType](id, !isDisplay)
      return
    }

    // assetをタイムライン表示用データに整形する
    const timelineData = {
      id,
      displayName,
      fileType: FILE_TYPE.ASSET,
      subFileType,
      startDateTime,
      endDateTime,
      isVisible: isDisplay
    }
    // タイムラインドロア表示時: タイムラインドロアに追加 / ドロアから外す＆アセットの非表示 / 表示 を切り替え
    if (isInTimeline) {
      setTimelineShowData([timelineData], false)
      setVisibilityFunctionList[subFileType](id, false)
    } else {
      if (isDisplay) {
        setTimelineShowData([timelineData], true)
        const timelineTime = visTimeline.visTimelineInstance.getCustomTime(
          MARKER_ID
        )
        const isShouldVisible =
          !startDateTime ||
          !endDateTime ||
          (new Date(startDateTime).getTime() <= timelineTime &&
            timelineTime <= new Date(endDateTime).getTime())
        // タイムラインに追加後の初期状態非表示の場合
        if (!isShouldVisible) {
          // アセットを非表示
          setVisibilityFunctionList[subFileType](id, false)
          // タイムラインに追加したアセットデータも非表示にする
          const assetDataInTimeline = visTimeline.visTimelineInstance.itemsData
            .get()
            .find(item => item.id === id)
          if (!assetDataInTimeline) return
          visTimeline.visTimelineInstance.itemsData.update({
            ...assetDataInTimeline,
            isVisible: false
          })
        }
      } else {
        setVisibilityFunctionList[subFileType](id, true)
      }
    }
  }

  const VisibleIcon = styledIcon(
    isInTimeline && isDrawerOpen ? IconVisibleTimeline : IconVisible
  )

  return (
    <IconWrapper onClick={setAssetVisibility}>
      {isInTimeline && isDrawerOpen ? (
        <VisibleIcon
          style={{ ...iconStyle(isMobile), width: '50px' }}
          color={isDisplay ? '#3a4248' : '#8e96a0'}
        />
      ) : (
        <VisibleIcon
          style={iconStyle(isMobile)}
          color={isDisplay ? '#3a4248' : '#8e96a0'}
        />
      )}
    </IconWrapper>
  )
}

export const VisibleController = React.memo<VisibleControllerProps>(Controller)
