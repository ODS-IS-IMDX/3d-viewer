// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { PureComponent, type Node } from 'react'
import styled, { css } from 'styled-components'
import { themed, Backdrop, Overlay } from '@ehv/design-system'

import theme from './theme'
import ModalHeader from './ModalHeader'
import ModalFooter from './ModalFooter'
import ModalContent from './ModalContent'
import ModalController from './ModalController'

export type ModalProps = {
  children: Node,
  /** モーダルの背景もしくは☓ボタンが押されたときに実行されるイベント */
  onClose?: () => void,
  header?: () => Node,
  footer?: () => Node,
  overHeader?: () => Node,
  variant?: 'default' | 'transparent' | 'small' | 'fixed640' | 'noPadding',
  closeButton?: boolean,
  isBackground?: boolean,
  zIndex?: number,
  modalContentStyled?: string,
  modalPosition?: {
    top?: number | string,
    right?: number | string,
    bottom?: number | string,
    left?: number | string
  }
}

const ModalOverlay = styled(Overlay)`
  ${({ width }) =>
    width &&
    css`
      width: ${width};
    `};
  ${({ height }) =>
    height &&
    css`
      height: ${height};
    `};
  ${({ minHeight }) =>
    minHeight &&
    css`
      min-height: ${minHeight};
    `};
  ${({ minWidth }) =>
    css`
      min-width: ${minWidth || '640px'};
    `};
  border-radius: 6px;
  flex-direction: column;
  ${({ backgroundColor }) =>
    backgroundColor
      ? css`
          background-color: ${backgroundColor};
        `
      : css`
          background-color: #ffffff;
        `};
  max-height: calc(100% - 20px);
  cursor: auto;

  ${({ modalPosition }) => {
    if (!modalPosition) {
      return
    }
    const { top, right, bottom, left } = modalPosition
    let cssString = 'min-width: 440px; position: fixed; z-index: 1;'
    if (top !== undefined) {
      cssString += isNaN(top) ? ` top: ${top};` : ` top: ${top}px;`
    }
    if (right !== undefined) {
      cssString += isNaN(right) ? ` right: ${right};` : ` right: ${right}px;`
    }
    if (bottom !== undefined) {
      cssString += isNaN(bottom)
        ? ` bottom: ${bottom};`
        : ` bottom: ${bottom}px;`
    }
    if (left !== undefined) {
      cssString += isNaN(left) ? ` left: ${left};` : ` left: ${left}px;`
    }
    return css`
      ${cssString}
    `
  }}

  ${// $FlowFixMe
  themed('Modal', theme)}
`

const Close = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 20px;
  height: 20px;
  cursor: pointer;

  &::after,
  &::before {
    content: '';
    width: 0;
    height: 100%;
    display: block;
    position: absolute;
    border-left: 2px solid white;
  }

  &::before {
    transform: translateX(9px) rotate(45deg);
  }

  &::after {
    transform: translateX(9px) rotate(-45deg);
  }
`

export class Modal extends PureComponent<ModalProps> {
  static Header = ModalHeader
  static Footer = ModalFooter
  static Controller = ModalController

  onClick = (event: Event) => {
    const { onClose } = this.props
    if (event.target === event.currentTarget && onClose) {
      onClose()
    }
  }

  renderOverHeader () {
    const { overHeader } = this.props
    if (typeof overHeader === 'function') {
      return overHeader()
    } else {
      return <>{overHeader}</>
    }
  }

  renderHeader () {
    const { header } = this.props
    if (typeof header === 'function') {
      return header()
    } else {
      return <ModalHeader>{header}</ModalHeader>
    }
  }

  renderFooter () {
    const { footer } = this.props
    if (typeof footer === 'function') {
      return footer()
    } else {
      return <ModalFooter>{footer}</ModalFooter>
    }
  }

  render () {
    const {
      header,
      footer,
      overHeader,
      children,
      variant,
      modalContentStyled = null,
      closeButton = true,
      isBackground = true,
      zIndex = 99990,
      ...rest
    } = this.props

    return this.props.modalPosition ? (
      <ModalOverlay {...rest} variant={variant}>
        {header && this.renderHeader()}
        <ModalContent variant={variant} modalContentStyled={modalContentStyled}>
          {children}
        </ModalContent>
        {footer && this.renderFooter()}
      </ModalOverlay>
    ) : (
      <>
        {isBackground ? (
          <Backdrop zIndex={zIndex} />
        ) : (
          <Backdrop zIndex={zIndex} bg='transparent' />
        )}
        <Backdrop zIndex={zIndex + 9} bg='transparent' onClick={this.onClick}>
          {overHeader && this.renderOverHeader()}
          {closeButton && <Close onClick={this.onClick} />}
          <ModalOverlay {...rest} variant={variant}>
            {header && this.renderHeader()}
            <ModalContent
              variant={variant}
              modalContentStyled={modalContentStyled}
            >
              {children}
            </ModalContent>
            {footer && this.renderFooter()}
          </ModalOverlay>
        </Backdrop>
      </>
    )
  }
}

export default Modal
