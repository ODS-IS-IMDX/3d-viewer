// Copyright (c) 2025 NTT InfraNet
import React from 'react'
import styled from 'styled-components'

import { IconClose } from '@ehv/datahub-icons'

export const PanelContainer = styled.div`
  width: ${props => props.width || '100%'}
  background-color: #f6f6f6;
  box-shadow: 0 1.5px 3px 0 rgba(0, 0, 0, 0.16);

  ${props =>
    props.right &&
    `
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  `}
  ${props =>
    props.left &&
    `
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  `}
`

export const PanelHeader = styled.div`
  height: calc(60px - 18px * 2);
  padding: 18px;
  position: relative;
  background-color: #ffffff;
  border-bottom: 1px solid #e6e6e6;

  ${props =>
    props.right &&
    `
    border-top-left-radius: 5px;
  `}
  ${props =>
    props.left &&
    `
    border-top-right-radius: 5px;
  `}
`

export const PanelBody = styled.div``

export const Divider = styled.div`
  width: 100%;
  margin: 0 8px;
  border-left: 1px solid #e6e6e6;
`

export const PanelCloseIcon = styled.div.attrs({ role: 'button', tabIndex: 0 })`
  outline: none;
  display: flex;
  cursor: pointer;
  position: absolute;
  top: 22px;
  right: 15px;
`

export const Panel = props => (
  <PanelContainer {...props}>
    <PanelHeader right={props.right} left={props.left}>
      {props.icon}
      {props.closable && (
        <PanelCloseIcon onClick={props.onClose}>
          <IconClose />
        </PanelCloseIcon>
      )}
    </PanelHeader>
    <PanelBody>{props.children}</PanelBody>
  </PanelContainer>
)
