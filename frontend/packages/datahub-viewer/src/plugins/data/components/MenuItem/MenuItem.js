// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { memo } from 'react'
import { FILE_TYPE } from 'plugins/data/constants'
import { MenuItemFolder } from '../MenuItemFolder'
import { MenuItemAsset } from '../MenuItemAsset'

import type { FC, ReactElement } from 'react'
import type { TreeItem } from 'react-complex-tree'

type MenuItemProps = {
  children: any,
  item: TreeItem<any>
}

const Component: FC<MenuItemProps> = (props: MenuItemProps): ReactElement => {
  const { children, item } = props
  const { fileType, subFileType, referenceId, isDirectory } = item.data

  if (isDirectory) {
    return (
      <>
        <MenuItemFolder {...props} />
        {/* ここに「children」を書かないと、フォルダに含まれている子要素が描画されない */}
        {children}
      </>
    )
  } else {
    switch (fileType) {
      case FILE_TYPE.ASSET:
        return (
          <MenuItemAsset
            key={referenceId}
            referenceId={referenceId}
            subFileType={subFileType}
          />
        )
      default:
        return null
    }
  }
}

export const MenuItem: FC<MenuItemProps> = memo<MenuItemProps>(Component)
