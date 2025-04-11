// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import styled from 'styled-components'

import {
  Box,
  Flex,
  Input as InputComponent,
  Text
} from '@ehv/datahub-components'

// $FlowFixMe
export const HeaderText = styled(Text).attrs({
  flex: 1,
  size: 2
})`
  white-space: pre-wrap;
`

type LabelProps = {
  children: React.Node,
  flex?: number
}
export const Label = ({ children, flex }: LabelProps) => (
  <Text flex={flex} py={2} fontSize={1}>
    {children}
  </Text>
)

type RequiredMarkProps = {
  children: React.Node,
  flex?: number
}
export const RequiredMark = ({ children, flex }: RequiredMarkProps) => (
  <Text color='warning' flex={flex} mx={1} py={2} fontSize={1}>
    {children}
  </Text>
)

type ErrorMessageProps = {
  children?: React.Node
}
export const ErrorMessage = ({ children }: ErrorMessageProps) => (
  <Box height='2rem'>
    <Text flex={1} px={2} py={2} fontSize={1} color='warning'>
      {children}
    </Text>
  </Box>
)

type InputProps = {
  editable: boolean,
  name: string,
  type?: string,
  step?: string,
  value: number | string,
  placeholder?: string,
  style?: string,
  // $FlowFixMe
  onChange?: (event: React.SyntheticEvent<HTMLInputElement>) => void,
  // $FlowFixMe
  onBlur?: (event: React.SyntheticEvent<HTMLInputElement>) => void,
  // $FlowFixMe
  onInput?: (event: React.SyntheticEvent<HTMLInputElement>) => void
}
// $FlowFixMe
export const Input = ({
  editable,
  name,
  type,
  step,
  value,
  placeholder,
  style,
  onChange,
  onBlur,
  onInput,
  ...restProps
}: InputProps) => {
  const StyledInput = style
    ? styled(InputComponent)`
        ${style}
      `
    : InputComponent
  const disableFlag = !!(!editable && type === 'color')
  return (
    <Flex flex={1} mb={1} mx={1}>
      <StyledInput
        {...restProps}
        name={name}
        type={type}
        step={step}
        variant={editable ? 'default' : 'readonly'}
        fontSize={1}
        flex={1}
        value={value}
        disabled={disableFlag}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        onInput={onInput}
      />
    </Flex>
  )
}

export const XSpacer = () => <Box mx={1} />
