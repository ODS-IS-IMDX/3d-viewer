// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Text, themed } from '@ehv/design-system'
import CustomRadioGroup from './CustomRadioGroup'

import theme from './theme.js'

export type CustomRadioProps = {
  label: string,
  value: any,
  width?: number
}

const StyledText = styled(Text)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ width }) => width || 40}px;
  height: 20px;
  border-radius: 5px;
  cursor: pointer;

  &:not(:first-child) {
    margin-left: 6px;
  }

  ${({ selected }) =>
    selected
      ? themed('CustomRadio.Selected', theme.Selected)
      : themed('CustomRadio', theme)}
`

export const CustomRadio = ({ label, width, ...props }: CustomRadioProps) => {
  const handleClick = useCallback(
    (value, onChange) => () => {
      onChange(value)
    },
    []
  )

  return (
    <CustomRadioGroup.Context.Consumer>
      {({ value, onChange }) => (
        <StyledText
          selected={value === props.value}
          onClick={handleClick(props.value, onChange)}
          width={width}
        >
          {label}
        </StyledText>
      )}
    </CustomRadioGroup.Context.Consumer>
  )
}

export default CustomRadio
