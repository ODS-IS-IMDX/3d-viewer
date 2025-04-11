// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'

import { SiteDrawerFill } from 'plugins/site'
import { TimelineDrawer } from '../TimelineDrawer'

type DataRouteProps = {|
  isDrawerOpen: boolean,
  isMobile: boolean
|}

export const DataRoute = (props: DataRouteProps) => {
  const { isDrawerOpen, isMobile } = props

  if (!isDrawerOpen) {
    return null
  }

  return (
    <>
      {/* モバイル版ではドロアタイプのタイムラインを表示しない */}
      {isDrawerOpen && !isMobile && (
        <SiteDrawerFill>
          <TimelineDrawer />
        </SiteDrawerFill>
      )}
    </>
  )
}
