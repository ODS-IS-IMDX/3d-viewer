// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { Fixed, Text, themed } from '@ehv/design-system'
import { IconActionGotoNext, IconClose } from '@ehv/datahub-icons'

import theme from './theme'

type FullScreenPhotoViewerProps = {
  children: React.Node,
  title: string,
  onNext: () => void,
  onPrevious: () => void,
  onClose: () => void
}

export const IconButton = styled.div.attrs({ role: 'button', tabIndex: 0 })`
  outline: none;
  display: flex;
  cursor: pointer;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  ${// $FlowFixMe
  themed('FullScreenPhotoViewer.IconButton', theme.IconButton)}
`

export const FullScreenPhotoViewerContainer = styled.div`
  display: flex;
`

const CloseIcon = styled(IconClose)`
  path:nth-child(2) {
    fill: white;
  }
`

const NextIcon = styled(IconActionGotoNext)`
  path:nth-child(2) {
    fill: white;
  }
`

const PrevIcon = styled(IconActionGotoNext)`
  transform: rotate(180deg);

  path:nth-child(2) {
    fill: white;
  }
`

const FixedFlex = styled(Fixed)`
  display: flex;
`

export class FullScreenPhotoViewer extends React.PureComponent<FullScreenPhotoViewerProps> {
  onKeyUp = (event: { keyCode: number }) => {
    const { onClose, onPrevious, onNext } = this.props

    switch (event.keyCode) {
      case 27:
        onClose()
        break
      case 37:
        onPrevious()
        break
      case 39:
        onNext()
        break
    }
  }

  componentDidMount () {
    window.addEventListener('keyup', this.onKeyUp)
  }

  componentWillUnmount () {
    window.removeEventListener('keyup', this.onKeyUp)
  }

  render () {
    const {
      children,
      title,
      onNext,
      onPrevious,
      onClose,
      ...props
    } = this.props

    return (
      <FixedFlex
        background='white'
        zIndex={99999}
        bottom={0}
        right={0}
        top={0}
        left={0}
        backgroundColor={'#353535'}
        {...props}
      >
        <Fixed top={5} right={5}>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Fixed>
        <Fixed left={5} top={'50%'}>
          <IconButton onClick={onPrevious}>
            <PrevIcon />
          </IconButton>
        </Fixed>
        <Fixed right={5} top={'50%'}>
          <IconButton onClick={onNext}>
            <NextIcon />
          </IconButton>
        </Fixed>
        <Fixed left={5} bottom={5}>
          <Text size={12} color={'white'}>
            {title}
          </Text>
        </Fixed>
        {children}
      </FixedFlex>
    )
  }
}
