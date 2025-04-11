// Copyright (c) 2025 NTT InfraNet
import styled from 'styled-components'
import { space, color } from 'styled-system'
import { themed } from '../utils'

import theme from './theme'

export const Radio = styled.input.attrs({ type: 'radio' })`
  width: 20px;
  height: 20px;
  margin: 0;
  outline: none;
  cursor: pointer;
  appearance: none;
  display: inline-flex;
  border-width: 2px;
  border-style: solid;
  border-radius: 50%;

  &:not(:checked)::after {
    display: none;
  }

  &::after {
    content: '';
    width: 67%;
    height: 67%;
    margin: auto;
    display: block;
    border-radius: 50%;
  }

  ${themed('Checkbox', theme, { mark: '&::after' })}
  ${space}
  ${color}
`

Radio.propTypes = {
  ...space.propTypes,
  ...color.propTypes
}
