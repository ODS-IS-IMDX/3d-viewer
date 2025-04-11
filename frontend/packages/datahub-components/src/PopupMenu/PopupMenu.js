// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import { Fixed } from '@ehv/design-system'

import { ClickOutside } from '../ClickOutside'

export type PopupMenuProps = {
  onClose: () => void,
  children: React.Node,
  position?: {
    top?: number,
    left?: number,
    right?: number,
    bottom?: number
  }
}

export const PopupMenu = ({
  onClose,
  position,
  children,
  ...props
}: PopupMenuProps) => {
  return (
    <ClickOutside onClickOutside={onClose}>
      <Fixed {...props} {...position} zIndex='2147483647'>
        {children}
      </Fixed>
    </ClickOutside>
  )
}

export default PopupMenu
