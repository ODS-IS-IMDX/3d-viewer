// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { memo } from 'react'
import styled from 'styled-components'
import { ControlledTreeEnvironment, Tree } from 'react-complex-tree'
import { Flex } from '@ehv/datahub-components'
import {
  TREE_ID,
  TREE_ROOT_INDEX,
  RENDER_DEPTH_OFFSET
} from 'plugins/data/constants'
import { OPEN_VIEW_NAME } from 'plugins/site/constants'
import { getTreeItems } from 'plugins/data/utils'
import { MenuItem } from '../MenuItem'
import { AddItemMenu } from './AddItemMenu'

import type { TFunction } from 'react-i18next'
import type { Asset } from 'plugins/asset/reducer'

const ActionArea = styled(Flex)`
  padding: 16px 8px 8px 8px;
`
const StyledAddItemMenu = styled(AddItemMenu)`
  flex: 1;
`
const TooltipWrapper = styled.div`
  flex-shrink: 0;
  margin-left: 16px;
  &:hover .description {
    display: flex;
    justify-content: center;
    transform: translate(68px, -40px);
  }
`
const Tooltip = styled.div`
  display: none;
  position: fixed;
  padding: 8px;
  font-size: 12px;
  line-height: 1.6em;
  color: #fff;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.8);
  white-space: pre-line;
`
const MenuShowContainer = styled(Flex)`
  background-color: #fafafa;
  .rct-tree-item-li::marker {
    content: none;
  }
  .rct-tree-item-button {
    width: 100%;
    text-align: left;
    background-color: #fafafa;
    border: none;
  }
  ${({ isMobile }) =>
    isMobile &&
    `
    .rct-tree-item-button-hasChildren {
      border-top: 1px solid #ddd;

      &:not(.rct-tree-item-button-expanded) {
        position: relative;

        &::after {
          content: '';
          display: inline-block;
          width: 100%;
          height: 1px;
          background-color: #ddd;
          position: absolute;
          top: 60px;
          left: 0px;
        }
      }
    }

    .rct-tree-item-li-hasChildren+.rct-tree-item-li-hasChildren > div > .rct-tree-item-button-hasChildren {
      border-top: none;
    }

    ul.rct-tree-items-container[role="group"] > li:last-child > div:only-child > .rct-tree-item-button {
      position: relative;

      &::after {
        content: '';
        display: inline-block;
        width: calc(100% + ${RENDER_DEPTH_OFFSET}px);
        height: 1px;
        background-color: #ddd;
        position: absolute;
        top: 60px;
        left: -${RENDER_DEPTH_OFFSET}px;
      }
    }
  `}
`
// -${RENDER_DEPTH_OFFSET}px:
// renderDepthOffsetを設定したら、ルートのMenuItemも右側にオフセットしてしまうので、その分を戻すため
const TreeContainer = styled.div`
  margin: ${({ isMobile }) =>
    isMobile
      ? `8px 22px 0 calc(22px - ${RENDER_DEPTH_OFFSET}px)`
      : `8px 0 0 -${RENDER_DEPTH_OFFSET}px`};
  height: ${({ isMobile }) => `calc(100vh - ${isMobile ? '60px' : '142px'});`}
    ${({ isMobile }) => isMobile && 'padding-bottom: 8px;'}
    ${({ isMobile, openViewName }) =>
      isMobile &&
      openViewName !== OPEN_VIEW_NAME.FILE_MENU &&
      'display: none;'};
`

export type MenuShowProps = {
  t: TFunction,
  assetList: Array<Asset>,
  isAssetLoading: boolean,
  isAssetError: boolean,
  viewStructure: any,
  isMobile: boolean,
  openViewName: string | null,
  setViewStructure: (data: any) => void,
  changeMenuMode: (menuMode: string) => void
}

const Component = ({
  t,
  assetList,
  isAssetLoading,
  isAssetError,
  isMobile,
  openViewName,
  viewStructure,
  setViewStructure,
  changeMenuMode,
  ...props
}: MenuShowProps) => {
  const { treeItems } = getTreeItems(viewStructure)
  const [expandedItems, setExpandedItems] = React.useState([])
  const [focusedItem, setFocusedItem] = React.useState([])

  return (
    <>
      {!isMobile && (
        <ActionArea justifyContent='space-between'>
          <StyledAddItemMenu />
          <TooltipWrapper>
            <Tooltip className='description'>{t('action.tooltip')}</Tooltip>
          </TooltipWrapper>
        </ActionArea>
      )}
      <MenuShowContainer flexDirection='column' isMobile={isMobile}>
        <ControlledTreeEnvironment
          items={treeItems}
          getItemTitle={item => item.data.title}
          viewState={{
            [TREE_ID]: {
              focusedItem,
              expandedItems,
              // 選択したアイテムを保持する必要がないため、ここに空きの配列を使用
              selectedItems: []
            }
          }}
          renderDepthOffset={RENDER_DEPTH_OFFSET}
          canSearch={false}
          canRename={false}
          onFocusItem={item => setFocusedItem(item.index)}
          onExpandItem={item =>
            setExpandedItems([...expandedItems, item.index])
          }
          onCollapseItem={item =>
            setExpandedItems(
              expandedItems.filter(itemIndex => itemIndex !== item.index)
            )
          }
          // フォルダのアイコンは<MenuItemFolder>に描画済みのため、ここにはあえて描画しない
          renderItemArrow={() => null}
          renderItemTitle={props => <MenuItem {...props} isMobile={isMobile} />}
          renderTreeContainer={({ children, containerProps }) => (
            <TreeContainer
              {...containerProps}
              isMobile={isMobile}
              openViewName={openViewName}
            >
              {children}
            </TreeContainer>
          )}
        >
          <Tree treeId={TREE_ID} rootItem={TREE_ROOT_INDEX} />
        </ControlledTreeEnvironment>
      </MenuShowContainer>
    </>
  )
}

export const MenuShow = memo<MenuShowProps>(Component)
