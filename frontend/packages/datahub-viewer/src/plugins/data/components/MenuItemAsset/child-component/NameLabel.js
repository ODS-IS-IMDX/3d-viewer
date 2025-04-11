// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import styled from 'styled-components'
import {
  Box,
  ContextMenuWithHook,
  useContextMenuWithElement,
  CornerType,
  Flex,
  Text
} from '@ehv/datahub-components'
import { ColorSelector, PointSizeSlider, TransparencySlider } from '.'
import { MENU_MODE, SUB_FILE_TYPE } from 'plugins/data/constants'
import { FORMAT_TYPE } from 'plugins/asset/constants'

import type { FC, ReactElement } from 'react'
import type { TFunction } from 'react-i18next'
import type { AssetID, Asset } from 'plugins/asset/reducer'
import { type DropdownColorOptionType } from './ColorSelector'
import { EHV_ASSET_TYPE } from 'plugins/file/constants'

const ContextMenuWithHookStyled = styled(ContextMenuWithHook)`
  width: auto;
  z-index: 9999;
  & > div {
    border-radius: 0 10px 10px 0;
  }
`
const ContextMenuItemsWrapper = styled(Box)`
  ${({ isShowOverflow }) => `
    overflow: ${isShowOverflow ? 'visible' : 'auto'};
  `}
  max-height: 350px;
`
const TextWrapper = styled(Text)`
  height: 30px;
  word-break: break-word;
  overflow-x: hidden;
  line-height: 30px;
  text-overflow: ellipsis;
  white-space: nowrap;
`
const ResetButton = styled(Box)`
  cursor: pointer;
  appearance: none;
  display: inline-block;
  text-align: center;
  text-decoration: none;
  outline: none;
  border: 0;
  color: #fff;
  background-color: #16abe3;
  width: 70px;
  height: 30px;
  padding: 7px 0;
  font-size: ${({ isMobile }) => (isMobile ? 12 : 10)}px;
  border-radius: 5px;

  &:hover {
    background-color: #0084b5;
  }
`
const CloseButton = styled(Box)`
  box-sizing: border-box;
  cursor: pointer;
  appearance: none;
  display: inline-block;
  text-align: center;
  text-decoration: none;
  outline: none;
  border-radius: 2px;
  color: #16abe3;
  border: 1px solid #16abe3;
  background-color: #fff;
  width: 30px;
  height: 30px;
  padding: 7px 0;
  font-size: 6px;

  &:hover {
    border: 1px solid #0084b5;
    background-color: #eee;
    color: #0084b5;
  }
`

export type NameLabelProps = {|
  asset: Asset,
  subFileType: number,
  openSideContextMenu: { close: (() => void) | null },
  menuMode: string,
  isMobile: boolean,
  ehvAssetType: string,
  setTopographyPointSize: (id: AssetID, pointSize: number) => void,
  setAssetStyle: (
    id: AssetID,
    style: { color: string, transparency: number }
  ) => void,
  setTopographyTransparency: (id: AssetID, transparency: number) => void,
  setOpenSideContextMenu: (close: (() => void) | null) => void,
  t: TFunction
|}
export const contextMenuItemsFactory: FC<NameLabelProps> = (
  props: NameLabelProps,
  closeContextMenu: (() => void) | null
): ReactElement => {
  const {
    asset,
    subFileType,
    isMobile,
    setTopographyPointSize,
    setAssetStyle,
    setTopographyTransparency,
    t
  } = props
  const { id, formatType, pointSize, style } = asset
  const { color, transparency } = style
  const baseElement = ({
    isDisplayResetButton,
    resetButtonClickHandler
  }: {
    isDisplayResetButton: boolean,
    resetButtonClickHandler?: Function
  }): ReactElement =>
    !isDisplayResetButton && isMobile ? null : (
      <Flex width='100%' justifyContent='space-between' alignItems='center'>
        <div>
          {isDisplayResetButton && (
            <ResetButton isMobile={isMobile} onClick={resetButtonClickHandler}>
              {t('common.contextMenu.reset')}
            </ResetButton>
          )}
        </div>
        {!isMobile && (
          <CloseButton onClick={closeContextMenu}>&#x2716;</CloseButton>
        )}
      </Flex>
    )

  // 統合地形
  if (subFileType === SUB_FILE_TYPE.ASSET.TOPOGRAPHY) {
    if (formatType === FORMAT_TYPE.LASER.VALUE) {
      // 統合地形の点群データの場合、点サイズ変更コンポーネント＆透明度変更コンポーネント
      return [
        baseElement({ isDisplayResetButton: false }),
        <TransparencySlider
          isMobile={isMobile}
          key='TransparencySlider'
          title={t('slider.transparency')}
          value={transparency}
          onAfterChange={value => setTopographyTransparency(id, value)}
        />,
        <PointSizeSlider
          isMobile={isMobile}
          key='PointSizeSlider'
          title={t('slider.pointSize')}
          value={pointSize}
          onAfterChange={value => setTopographyPointSize(id, value)}
        />,
        <ColorSelector
          isMobile={isMobile}
          key='ColorSelector'
          id={id}
          selectorLabel={t('common.assetStyleContextMenu.selectorLabel')}
          defaultValueLabel={t(
            'common.assetStyleContextMenu.defaultValueLabel'
          )}
          value={color}
          onChange={(option: DropdownColorOptionType) => {
            setAssetStyle(id, { color: option.value, transparency })
          }}
        />
      ]
    } else {
      // 上記以外の場合、透明度変更コンポーネント
      return [
        baseElement({ isDisplayResetButton: false }),
        <TransparencySlider
          isMobile={isMobile}
          key='TransparencySlider'
          title={t('slider.transparency')}
          value={transparency}
          onAfterChange={value =>
            setAssetStyle(id, { color, transparency: value })
          }
        />
      ]
    }
  }

  // 設計ファイル
  if (subFileType === SUB_FILE_TYPE.ASSET.DESIGNFILE) {
    return [
      baseElement({ isDisplayResetButton: false }),
      <TransparencySlider
        isMobile={isMobile}
        key='TransparencySlider'
        title={t('slider.transparency')}
        value={transparency}
        onAfterChange={value =>
          setAssetStyle(id, { color, transparency: value })
        }
      />,
      <ColorSelector
        isMobile={isMobile}
        key='ColorSelector'
        id={id}
        selectorLabel={t('common.assetStyleContextMenu.selectorLabel')}
        defaultValueLabel={t('common.assetStyleContextMenu.defaultValueLabel')}
        value={color}
        onChange={(option: DropdownColorOptionType) => {
          if (formatType === FORMAT_TYPE.GLTF.VALUE && !option.value) {
            setAssetStyle(id, { color: '#FFFFFF', transparency })
          } else {
            setAssetStyle(id, { color: option.value, transparency })
          }
        }}
      />
    ]
  }
}

const NameLabelComponent = (props: NameLabelProps) => {
  const { displayName, isDisplay, customPosition, ehvAssetType } = props.asset
  const {
    menuMode,
    isMobile,
    openSideContextMenu,
    setOpenSideContextMenu
  } = props

  const isEdited = 'transform' in (customPosition || {})
  const {
    isMenuOpen,
    menuPosition,
    elementRef,
    openContextMenu,
    closeContextMenu
  } = useContextMenuWithElement({
    elementCorner: CornerType.topRight,
    menuCorner: CornerType.topLeft,
    absolute: { x: isEdited ? 136 : 106, y: 0 },
    menuHeight: 224
  })
  const labelClickHandler = event => {
    if (
      menuMode === MENU_MODE.EDIT ||
      !(
        ehvAssetType === EHV_ASSET_TYPE.EHV_TILE ||
        ehvAssetType === EHV_ASSET_TYPE.EHV_SPACE_INFO
      )
    ) {
      return
    }
    event.stopPropagation()
    openContextMenu(event)
    if (!isMenuOpen) {
      if (openSideContextMenu.close) {
        openSideContextMenu.close(event)
      }
      setOpenSideContextMenu(closeContextMenu)
    }
  }

  const closeSideContextMenu = event => {
    closeContextMenu(event)
    setOpenSideContextMenu(null)
  }

  const contextMenuItems =
    isMenuOpen && isDisplay
      ? contextMenuItemsFactory(props, closeSideContextMenu)
      : null
  const isContextVisible = Array.isArray(contextMenuItems)

  return (
    <>
      <TextWrapper
        ref={elementRef}
        pl={2}
        flex={1}
        fontSize={isMobile ? 16 : 12}
        color={isDisplay ? '#3a4248' : '#8e96a0'}
        title={displayName}
        onClick={labelClickHandler}
      >
        {displayName}
      </TextWrapper>
      {isContextVisible && (
        <ContextMenuWithHookStyled position={menuPosition}>
          {/* 色変更プルダウンを持つコンテキストメニューであれば、overflowの部分を表示してスクロールバーを非表示 */}
          <ContextMenuItemsWrapper
            // $FlowFixMe[incompatible-use]: isContextVisibleでcontextMenuItemsが配列であることを判明のため、エラー抑制
            isShowOverflow={
              !!contextMenuItems.find(item => item.key === 'ColorSelector') &&
              contextMenuItems.length < 5
            }
          >
            {/* $FlowFixMe[incompatible-use]: 同上 */}
            {contextMenuItems.map(item => (
              // $FlowFixMe[incompatible-use]: 同上
              <ContextMenuWithHook.Item key={item.key}>
                {item}
              </ContextMenuWithHook.Item>
            ))}
          </ContextMenuItemsWrapper>
        </ContextMenuWithHookStyled>
      )}
    </>
  )
}

export const NameLabel = React.memo<NameLabelProps>(NameLabelComponent)
