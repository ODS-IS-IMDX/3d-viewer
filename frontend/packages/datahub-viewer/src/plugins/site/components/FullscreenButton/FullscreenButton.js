// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import styled from 'styled-components'
import { Button, themed } from '@ehv/datahub-components'
import { IconFullscreenEnter, IconFullscreenExit } from '@ehv/datahub-icons'
import theme from './theme'

export type FullscreenButtonProps = {
  isFullscreen?: boolean,
  isDisabled?: boolean,
  onClick: () => void
}

// $FlowFixMe
const ButtonWrapper = styled(Button)`
  cursor: pointer;
  ${themed('FullscreenButton.Button', theme.Button)}
`
const IconFullscreenEnterWrapper = styled(IconFullscreenEnter)`
  ${themed('FullscreenButton.Icon', theme.Icon)}
`
const IconFullscreenExitWrapper = styled(IconFullscreenExit)`
  ${themed('FullscreenButton.Icon', theme.Icon)}
`
const color = '#fff'

export const FullscreenButton = ({
  isFullscreen = false,
  isDisabled = false,
  onClick,
  ...props
}: FullscreenButtonProps) => {
  return (
    <ButtonWrapper onClick={onClick} disabled={isDisabled}>
      {!isFullscreen ? (
        <IconFullscreenEnterWrapper color={color} />
      ) : (
        <IconFullscreenExitWrapper color={color} />
      )}
    </ButtonWrapper>
  )
}
