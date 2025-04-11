// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import styled from 'styled-components'
import { Text, List, Flex } from '@ehv/datahub-components'
import { IconGroupExpand, IconRight } from '@ehv/datahub-icons'
import { ContextMenuWithButton, VisibleController } from './child-component'

import type { FC, ReactElement } from 'react'
import type { TreeItem, TreeItemRenderContext } from 'react-complex-tree'

const ListItemWrapper: any = styled(List.Item)`
  height: ${({ isMobile }) => (isMobile ? '60px' : '30px')};
  svg {
    align-self: end;
  }
`
const TextWrapper = styled(Text)`
  overflow-x: hidden;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
`

type IconProps = {|
  hasChildren: boolean,
  isExpanded: boolean,
  isMobile: boolean
|}
const Icon: FC<IconProps> = (props: IconProps): ReactElement => {
  const { hasChildren, isExpanded, isMobile } = props
  const iconStyle = {
    width: isMobile ? '20px' : '13px',
    margin: isMobile ? 'auto 4px' : 'auto 0px'
  }
  if (hasChildren) {
    if (isExpanded) {
      return <IconGroupExpand style={iconStyle} />
    } else {
      return <IconRight style={iconStyle} />
    }
  } else {
    return null
  }
}

const countItem = (dataList: any): number => {
  let itemNumber = 0
  dataList.forEach(data => {
    if (data.isDirectory) {
      itemNumber += countItem(data.children)
    } else {
      ++itemNumber
    }
  })
  return itemNumber
}

type MenuItemFolderProps = {|
  context: TreeItemRenderContext<any>,
  menuItemFolderProps: any,
  menuItemFolderContextMenuProps: any,
  item: TreeItem<any>,
  isMobile: boolean
|}
const MenuItem: FC<MenuItemFolderProps> = (
  props: MenuItemFolderProps
): ReactElement => {
  const { context, menuItemFolderContextMenuProps, item, isMobile } = props
  const { isExpanded, collapseItem, expandItem } = context
  const { data, hasChildren } = item
  const { name, nodeID } = data

  return (
    <ListItemWrapper
      key={nodeID}
      isMobile={isMobile}
      isExpanded={isExpanded}
      onClick={() => (isExpanded ? collapseItem() : expandItem())}
    >
      <Flex alignItems='center' flex={1} py={1} width='100%'>
        {/* アイコン */}
        <Icon
          hasChildren={hasChildren}
          isExpanded={isExpanded}
          isMobile={isMobile}
        />
        {/* フォルダ名 */}
        <TextWrapper pl={2} flex={1} fontSize={isMobile ? 16 : 12} title={name}>
          {`${name}(${countItem(data.children)})`}
        </TextWrapper>
        <VisibleController element={data} />
        <ContextMenuWithButton
          {...menuItemFolderContextMenuProps}
          item={item}
        />
      </Flex>
    </ListItemWrapper>
  )
}

export const MenuItemFolder: FC<MenuItemFolderProps> = React.memo<MenuItemFolderProps>(
  MenuItem
)
