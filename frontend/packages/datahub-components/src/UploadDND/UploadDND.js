// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { useState, type Element, type Component } from 'react'
import styled from 'styled-components'
import { type UploadDNDContainerProps } from './UploadDNDContainer'
import UploadDNDHandler from './UploadDNDHandler'

export type UploadDNDProps = {
  ...UploadDNDContainerProps,
  overlay?: Component<{ visible: boolean }>,
  disabled?: boolean,
  children: Element<any>
}

const Wrapper = styled.div`
  position: relative;
`

export const UploadDND = (props: UploadDNDProps) => {
  const { disabled, overlay: Overlay, children } = props
  const [showOverlay, setShowOverlay] = useState(false)

  const handleChangeShowOverlay = (showOverlay: boolean) =>
    setShowOverlay(showOverlay)

  return (
    <Wrapper>
      <UploadDNDHandler
        canDrop={!disabled}
        showOverlay={showOverlay}
        onChangeShowOverlay={handleChangeShowOverlay}
        {...props}
      >
        <div>{children}</div>
      </UploadDNDHandler>
      {/* $FlowFixMe */}
      {Overlay && <Overlay visible={showOverlay} />}
    </Wrapper>
  )
}
