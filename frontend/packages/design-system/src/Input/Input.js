// Copyright (c) 2025 NTT InfraNet
import styled from 'styled-components'
import {
  borders,
  borderColor,
  boxShadow,
  borderRadius,
  fontWeight,
  fontSize,
  lineHeight,
  textAlign,
  width
} from 'styled-system'
import { flexbox } from '@styled-system/flexbox'

import { themed } from '../utils'

const theme = {
  variants: {
    default: {
      states: {
        hover: {
          borderBottom: '1px solid #3a4248'
        },
        focus: {
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #16abe3'
        },
        invalid: {
          borderBottom: '1px solid #ed4f5b !important'
        }
      }
    },
    primary: {
      color: '#3a4248',
      borderBottom: '1px solid #d0d0d0',
      backgroundColor: '#16abe3',
      states: {
        hover: {
          backgroundColor: '#0084b5'
        }
      }
    },
    secondary: {
      color: '#3a4248',
      borderBottom: '1px solid #d0d0d0',
      backgroundColor: '#3a4248',
      states: {
        hover: {
          backgroundColor: '#1c1e1f'
        }
      }
    },
    readonly: {
      color: '#3a4248',
      borderBottom: '1px solid #d0d0d0',
      backgroundColor: '#ffffff',
      cursor: 'auto',
      caretColor: 'transparent'
    }
  }
}

export const Input = styled.input`
  border: 0;
  margin: 0;
  display: inline-block;
  appearance: none;
  background-color: #f6f6f6;
  color: #3a4248;
  border-radius: 2px;
  outline: none;
  font-size: 16px;
  padding: 12px;

  ${borders}
  ${borderColor}
  ${boxShadow}
  ${borderRadius}
  ${flexbox}
  ${fontSize}
  ${fontWeight}
  ${lineHeight}
  ${textAlign}
  ${width}
  ${themed('Input', theme)}
`

// const Label = styled.label`
//   color: #b2b9c1;
//   font-size: 12px;
//   display: inline-block;
//   margin-bottom: 7px;
// `

// const Error = styled.label`
//   color: #ed4f5b;
//   font-size: 12px;
//   display: inline-block;
//   margin-top: 7px;
//   padding-left: 10px;
// `

// export const Input = props => (
//   <label>
//     {props.label && <Label>{props.label}</Label>}
//     <InputI {...props} />
//     {props.error && <Error>{props.error}</Error>}
//   </label>
// )

Input.propTypes = {
  ...lineHeight.propTypes,
  ...width.propTypes,
  ...borders.propTypes,
  ...borderColor.propTypes,
  ...boxShadow.propTypes,
  ...borderRadius.propTypes
}

Input.defaultProps = {
  variant: 'default'
}
