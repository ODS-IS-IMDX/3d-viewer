// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'

import { Box } from '../index'

const ContentWrapper = styled(Box)`
  width: ${({ width }) => width || '216px'};
  height: ${({ height }) => height || 'auto'};
  border-radius: 6px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  background-color: #ffffff;
  padding: 6px 16px;
`

export type PopupMenuContentProps = {
  children: React.Node,
  width?: string,
  height?: string
}

export const PopupMenuContent = ({
  children,
  width,
  height
}: PopupMenuContentProps) => {
  return (
    <ContentWrapper width={width} height={height}>
      {children}
    </ContentWrapper>
  )
}

export default PopupMenuContent
