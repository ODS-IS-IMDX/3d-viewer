// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { memo } from 'react'
import { ScreenSpaceEventHandler } from '../../react-cesium'
import { ScreenSpaceEventType } from 'cesium'

type ClickWithoutMouseMoveProps = {|
  entityList: Array<any>,
  onClick: (click: any) => void
|}

let isClickEventCancelled = false
export const Component = (props: ClickWithoutMouseMoveProps) => {
  const { entityList, onClick } = props
  if (!onClick) {
    return null
  }

  const onLeftDown = () => {
    isClickEventCancelled = false
  }
  const onMove = () => {
    isClickEventCancelled = true
  }
  const onLeftUp = (click: any) => {
    !isClickEventCancelled && onClick(click)
  }

  return (
    /*
     * ScreenSpaceEventHandlerにentityListを入れる原因：
     * entityListが変わるたびに、変更されたonClickをScreenSpaceEventHandlerに適用するため
     */
    <ScreenSpaceEventHandler entityList={entityList}>
      <ScreenSpaceEventHandler.InputAction
        action={onLeftDown}
        type={ScreenSpaceEventType.LEFT_DOWN}
      />
      <ScreenSpaceEventHandler.InputAction
        action={onMove}
        type={ScreenSpaceEventType.MOUSE_MOVE}
      />
      <ScreenSpaceEventHandler.InputAction
        action={onLeftUp}
        type={ScreenSpaceEventType.LEFT_UP}
      />
    </ScreenSpaceEventHandler>
  )
}

export const ClickWithoutMouseMove = memo<ClickWithoutMouseMoveProps>(Component)
