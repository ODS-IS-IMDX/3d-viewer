// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import styled from 'styled-components'
import { Input, Box, themed } from '@ehv/design-system'
import theme from './theme'

export type InputWithLabelProps = {
  name?: string,
  label?: string
}

const InputWrapper = styled(Input)`
  width: 100%;
  margin-top: 0px;
`

const Label = styled.label`
  display: block;
  margin-bottom: 7px;
  ${themed('InputWithLabel.Label', theme.Label)};
`

export const InputWithLabel = (props: InputWithLabelProps) => {
  const { label, name } = props

  return (
    <Box {...props}>
      {label && <Label htmlFor={name}>{label}</Label>}
      <InputWrapper {...props} />
    </Box>
  )
}
