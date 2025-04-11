// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import styled from 'styled-components'
import { Flex, List } from '@ehv/datahub-components'
import { IconFileDesignFile, IconFileTopography } from '@ehv/datahub-icons'
import {
  ContextMenuWithButton,
  NameLabel,
  VisibleController,
  ZoomController
} from './child-component'
import { SUB_FILE_TYPE } from 'plugins/data/constants'
import { CESIUM_ION_TYPES } from 'plugins/asset/constants'

import type { FC, ReactElement } from 'react'
import type { TFunction } from 'react-i18next'
import type { AssetID, Asset } from 'plugins/asset/reducer'
import type { TopographySetPointSizeAction } from 'plugins/asset/actions'

import 'rc-slider/assets/index.css'
import EditStatusIcon from './child-component/EditStatusIcon'

// $FlowFixMe[signature-verification-failure]
export const ListItemWrapper = styled(List.Item)`
  ${({ isMobile }) => isMobile && 'height: 60px;'}

  svg {
    align-self: end;
  }
`
type IconProps = {
  subFileType: number,
  color: string,
  isMobile: boolean
}
export const Icon: FC<IconProps> = (props: IconProps): ReactElement => {
  const { subFileType, color, isMobile } = props
  const iconStyle = {
    width: isMobile ? '20px' : '13px',
    margin: isMobile ? 'auto 4px' : 'auto 0px',
    color
  }
  switch (subFileType) {
    case SUB_FILE_TYPE.ASSET.TOPOGRAPHY:
      return <IconFileTopography style={iconStyle} />
    case SUB_FILE_TYPE.ASSET.DESIGNFILE:
      return <IconFileDesignFile style={iconStyle} />
    default:
      return null
  }
}

type MenuItemAssetProps = {
  referenceId: AssetID,
  subFileType: number,
  assetList: Array<Asset>,
  menuMode: string,
  openSideContextMenu: { close: (() => void) | null },
  isMobile: boolean,
  viewer: any,
  setTopographyPointSize: (
    id: AssetID,
    pointSize: number
  ) => TopographySetPointSizeAction,
  setAssetStyle: (id: AssetID, { color: string, transparency: number }) => void,
  resetAssetStyle: (id: AssetID) => void,
  setTopographyTransparency: (id: AssetID, transparency: number) => void,
  setOpenSideContextMenu: (close: (() => void) | null) => void,
  t: TFunction
}
const MenuItem: FC<MenuItemAssetProps> = (
  props: MenuItemAssetProps
): ReactElement => {
  const {
    referenceId,
    subFileType,
    assetList,
    menuMode,
    openSideContextMenu,
    isMobile,
    viewer,
    setTopographyPointSize,
    setAssetStyle,
    resetAssetStyle,
    setTopographyTransparency,
    setOpenSideContextMenu,
    t
  } = props

  const asset = assetList.find(asset => asset.id === referenceId)
  if (!asset) {
    return null
  }
  return (
    <ListItemWrapper isMobile={isMobile}>
      <Flex alignItems='center' flex={1} width='100%'>
        <Icon
          subFileType={subFileType}
          color={asset.isDisplay ? '#3a4248' : '#8e96a0'}
          isMobile={isMobile}
        />
        <NameLabel
          isMobile={isMobile}
          asset={asset}
          subFileType={subFileType}
          menuMode={menuMode}
          openSideContextMenu={openSideContextMenu}
          viewer={viewer}
          setTopographyPointSize={setTopographyPointSize}
          setAssetStyle={setAssetStyle}
          resetAssetStyle={resetAssetStyle}
          setTopographyTransparency={setTopographyTransparency}
          setOpenSideContextMenu={setOpenSideContextMenu}
          t={t}
        />
        {'transform' in (asset.customPosition || {}) && (
          <EditStatusIcon asset={asset} isMobile={isMobile} t={t} />
        )}
        {(subFileType !== SUB_FILE_TYPE.ASSET.TOPOGRAPHY ||
          asset.ionAssetType !== CESIUM_ION_TYPES.TERRAIN) && (
          <>
            <ZoomController asset={asset} subFileType={subFileType} />
            <VisibleController asset={asset} subFileType={subFileType} />
          </>
        )}
        {!isMobile && (
          <ContextMenuWithButton asset={asset} subFileType={subFileType} />
        )}
      </Flex>
    </ListItemWrapper>
  )
}

export const MenuItemAsset: FC<MenuItemAssetProps> = React.memo<MenuItemAssetProps>(
  MenuItem
)
