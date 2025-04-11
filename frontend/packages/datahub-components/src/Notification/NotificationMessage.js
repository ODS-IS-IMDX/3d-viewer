// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { Text } from '@ehv/design-system'

export type NotificationMessageProps = {
  className: string,
  message: string
}

const StyledText = styled(Text).attrs({
  size: 1
})`
  margin: 18px 0;
  cursor: inherit;
  color: inherit;
  flex: auto;
  hyphens: auto;
  white-space: pre;
  text-overflow: ellipsis;
  overflow: hidden;
`

export const NotificationMessage = ({
  className,
  message
}: NotificationMessageProps): React.Node => {
  return <StyledText className={className}>{message}</StyledText>
}
