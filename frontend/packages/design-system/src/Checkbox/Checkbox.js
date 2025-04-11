// Copyright (c) 2025 NTT InfraNet
import styled from 'styled-components'
import { space, color } from 'styled-system'
import { themed } from '../utils'

export const theme = {
  variants: {
    default: {
      width: 16,
      height: 16,
      borderRadius: 4,
      border: '1px solid #abbcc9',
      states: {
        checked: {
          backgroundColor: '#16abe3',
          border: 'none'
        }
      }
    },
    round: {
      width: 18,
      height: 18,
      borderRadius: '50%',
      border: '1px solid #e1e1e1',
      states: {
        checked: {
          backgroundColor: '#16abe3',
          border: 'none'
        }
      },
      checkmark: {
        display: 'none'
      }
    }
  }
}

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  margin: 0;
  outline: none;
  cursor: pointer;
  appearance: none;
  display: inline-block;
  
  &:not(:checked)::after {
    display: none;
  }

  &::after {
    content: '';
    display: block;
    width: 40%;
    height: 60%;
    border: solid #fff;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    margin-left: 30%;
    margin-top: 15%;
  }

  ${themed('Checkbox', theme, { checkmark: '&::after' })}
  ${space}
  ${color}
`

Checkbox.defaultProps = {
  variant: 'default'
}

Checkbox.propTypes = {
  ...space.propTypes,
  ...color.propTypes
}
