// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { Button, Text } from '@ehv/design-system'

type ButtonProps = {
  className: string,
  onClick: (SyntheticEvent<>) => void,
  text: string
}

const StyledButton = styled(Button)`
  margin-right: 18px;
  padding: 0;
`

const StyledText = styled(Text)`
  cursor: inherit;
  color: inherit;
`

export const NotificationButton = ({
  className,
  onClick,
  text
}: ButtonProps) => (
  <StyledButton className={className} onClick={onClick} variant='minimal'>
    <StyledText className={className} size={1}>
      {text}
    </StyledText>
  </StyledButton>
)
