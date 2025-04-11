// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import styled from 'styled-components'
import { Flex } from '@ehv/design-system'

type ScaleProps = {
  width: number,
  value: string
}

const ScaleRuler = styled.div`
  position: relative;
  margin-right: 10px;
  width: ${// $FlowFixMe
  props => props.width}px;
  height: 12px;
  border-bottom: 2px solid #f6f6f6;
  border-right: 2px solid #f6f6f6;
  border-left: 2px solid #f6f6f6;
`

const ScaleCenter = styled.div`
  position: absolute;
  border-left: 2px solid #f6f6f6;
  width: 50%;
  height: 5px;
  left: 50%;
  bottom: 0;
`

const ScaleValue = styled.div`
  margin-top: -2px;
  color: #f6f6f6;
  min-width: 57px;
`

export const Scale = ({ width, value }: ScaleProps) => (
  <Flex>
    <ScaleRuler width={width}>
      <ScaleCenter />
    </ScaleRuler>
    <ScaleValue>{value}</ScaleValue>
  </Flex>
)

export default Scale
