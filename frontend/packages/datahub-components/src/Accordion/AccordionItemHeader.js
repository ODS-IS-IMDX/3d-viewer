// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { useEffect } from 'react'
import type { ComponentType, Node } from 'react'
import styled from 'styled-components'
import { Flex, themed } from '@ehv/design-system'
import {
  IconGroupExpand,
  IconGroupCollapse,
  IconListNotAvailable
} from '@ehv/datahub-icons'
import { noop } from 'lodash/fp'

import theme from './theme'

type AccordionItemHeaderProps = {
  Icon?: ComponentType<{}>,
  children: Node,
  variant: string,
  expanded?: boolean,
  disabled?: boolean,
  onClick?: () => void,
  setExpanded: (value: boolean) => void
}

export const AccordionItemHeaderWrapper = styled(Flex)`
  flex-shrink: 0;
  cursor: ${props => (props.cursor ? props.cursor : 'pointer')};
  align-items: center;
  ${// $FlowFixMe */
  themed('Accordion.Item.Header', theme.Item.Header)}
`

const IconWrapper = styled(Flex)`
  padding: 12px;
  width: 40px;
  height: 40px;
`

const AccordionItemHeader = ({
  Icon,
  children,
  disabled = false,
  onClick,
  setExpanded,
  ...rest
}: AccordionItemHeaderProps) => {
  const { variant, expanded } = rest

  useEffect(() => {
    if (!!disabled && !!expanded) {
      setExpanded(false)
    }
  })

  let collapseIcon
  if (disabled) {
    collapseIcon = <IconListNotAvailable />
  } else {
    collapseIcon = (
      <IconWrapper>
        {expanded ? <IconGroupCollapse /> : <IconGroupExpand />}
      </IconWrapper>
    )
  }

  return (
    <AccordionItemHeaderWrapper {...rest} onClick={disabled ? noop : onClick}>
      {variant === 'default' || (variant === 'submenu' && collapseIcon)}
      {Icon ? <Icon /> : collapseIcon}
      {children}
    </AccordionItemHeaderWrapper>
  )
}

export default AccordionItemHeader
