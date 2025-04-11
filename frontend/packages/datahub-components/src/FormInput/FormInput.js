// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { Box, Input as DSInput, Text, themed } from '@ehv/design-system'
import theme from './theme'

export type FormInputProps = {
  autocomplete?: string,
  autoFocus?: boolean,
  disabled?: boolean,
  defaultValue?: string,
  error?: string,
  label?: string,
  name: string,
  onBlur?: () => void,
  onChange?: () => void,
  onFocus?: () => void,
  prefix?: string,
  suffix?: string,
  touched?: boolean,
  type?: string,
  value?: string,
  step?: string | number,
  placeholder?: string
}

const Container = styled(Box)`
  position: relative;

  ${({ prefix }) =>
    prefix &&
    `
    &:before {
      content: "${prefix}";
      position: absolute;
      top: 30%;
      left: 1rem;
      color: #8e96a0;
    }
  `}

  ${({ suffix }) =>
    suffix &&
    `
    &:after {
      content: "${suffix}";
      position: absolute;
      top: 30%;
      right: 2rem;
      color: #8e96a0;
    }
  `}
`

const StyledInput = styled(DSInput)`
  border-bottom: 1px solid #3a4248;
  ${({ prefix }) => prefix && 'padding-left: 2rem;'}
  ${// $FlowFixMe
  themed('FormInput', theme)}
`

const Label = styled.label`
  display: block;
  margin-bottom: 7px;
  ${// $FlowFixMe
  themed('FormInput.Label', theme.Label)};
`

const Error = styled(Text)`
  margin-top: 7px;
  margin-left: 12px;

  ${// $FlowFixMe
  themed('FormInput.Error', theme.Error)}
`

export function FormInput ({
  autocomplete,
  autoFocus,
  disabled,
  defaultValue,
  error,
  label,
  name,
  onBlur,
  onChange,
  onFocus,
  prefix,
  suffix,
  touched,
  type,
  value,
  step,
  placeholder,
  ...props
}: FormInputProps) {
  return (
    <Box {...props}>
      {label && (
        <Label htmlFor={name} {...props}>
          {label}
        </Label>
      )}
      <Container prefix={prefix} suffix={suffix}>
        <StyledInput
          disabled={disabled}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          type={type}
          name={name}
          value={value}
          invalid={touched && !!error}
          autocomplete={autocomplete}
          prefix={prefix}
          autoFocus={autoFocus}
          placeholder={placeholder}
          step={step}
        />
        {error && touched && <Error>{error}</Error>}
      </Container>
    </Box>
  )
}
