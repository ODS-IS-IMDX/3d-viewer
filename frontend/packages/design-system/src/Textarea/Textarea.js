// Copyright (c) 2025 NTT InfraNet
import styled from 'styled-components'
import {
  lineHeight,
  fontWeight,
  fontSize,
  textAlign,
  width,
  borders,
  borderColor,
  boxShadow,
  borderRadius
} from 'styled-system'
import { flexbox } from '@styled-system/flexbox'

import { themed } from '../utils'

const theme = {
  fontFamily: 'Source Sans Pro',
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

export const Textarea = styled.textarea`
  display: inline-block;
  margin: 0;
  padding: 12px;
  appearance: none;
  border: 0;
  border-radius: 2px;
  background-color: #f6f6f6;
  color: #3a4248;
  font-size: 16px;
  outline: none;
  overflow-x: hidden;
  overflow-y: hidden;
  &:hover {
    overflow-x: overlay;
    overflow-y: overlay;
  }

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
  ${themed('Textarea', theme)}
`

Textarea.propTypes = {
  ...lineHeight.propTypes,
  ...width.propTypes,
  ...borders.propTypes,
  ...borderColor.propTypes,
  ...boxShadow.propTypes,
  ...borderRadius.propTypes
}

Textarea.defaultProps = {
  variant: 'default'
}
