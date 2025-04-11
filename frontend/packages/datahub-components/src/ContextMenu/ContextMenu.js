// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { Flex, Fixed, themed } from '@ehv/design-system'
import { BaseStyle } from '../Style'

import ContextMenuItem from './ContextMenuItem'
import ContextMenuDivider from './ContextMenuDivider'
import ContextMenuTrigger from './ContextMenuTrigger'

import theme from './theme'

export type ContextMenuProps = {
  onClose: () => void,
  children: React.Node,
  position: {
    top: number,
    left: number,
    right: number,
    bottom: number
  },
  height?: number,
  width?: number,
  /** trueの場合は要素をクリックしたときにメニューを閉じる */
  isClosableByClick: boolean
}

export const ContextMenuWrapper = styled(Flex)`
  ${props =>
    !props.isMobile ? BaseStyle : 'overflow-x: overlay; overflow-y: overlay;'}

  border-radius: 8px;
  flex-direction: column;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  ${// $FlowFixMe
  themed('ContextMenu', theme)}
`

export const ContextMenu = ({
  onClose,
  position,
  width = 184,
  height,
  isClosableByClick = true,
  children,
  ...props
}: ContextMenuProps) => (
  <Fixed
    width={width}
    {...props}
    {...position}
    tabIndex='0'
    onBlur={onClose}
    onClick={isClosableByClick ? onClose : undefined}
    ref={ref => ref && ref.focus()}
    style={{ outline: 'none' }}
  >
    <ContextMenuWrapper
      width={1}
      py={2}
      height={height}
      isMobile={props.isMobile}
    >
      {children}
    </ContextMenuWrapper>
  </Fixed>
)

ContextMenu.Item = ContextMenuItem
ContextMenu.Divider = ContextMenuDivider
ContextMenu.Trigger = ContextMenuTrigger

export default ContextMenu
