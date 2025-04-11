// Copyright (c) 2025 NTT InfraNet
import styled from 'styled-components'
import {
  color,
  fontWeight,
  fontSize,
  lineHeight,
  textAlign
} from 'styled-system'

import Box from '../Box'
import { themed } from '../utils'

export const theme = {
  color: '#3a4248',
  fontFamily: 'Source Sans Pro',
  sizes: [
    {
      as: 'div',
      fontSize: 12,
      fontWeight: 400
    },
    {
      as: 'div',
      fontSize: 14,
      fontWeight: 400,
      lineHeight: 1.36
    },
    {
      as: 'div',
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 1.25
    },
    {
      as: 'h6',
      fontSize: 18,
      fontWeight: 400
    },
    {
      as: 'h5',
      fontSize: 18,
      fontWeight: 600,
      lineHeight: 1.06
    },
    {
      as: 'div',
      fontSize: 24,
      fontWeight: 400
    },
    {
      as: 'div',
      fontSize: 24,
      fontWeight: 600
    },
    {
      as: 'div',
      fontSize: 32,
      fontWeight: 400
    },
    {
      as: 'div',
      fontSize: 32,
      fontWeight: 600
    }
  ],
  colors: {
    warning: {
      color: '#ed5b66'
    }
  }
}

const attrs = (key, fallback) => props => {
  const theme = props.theme[key] || fallback

  if (props.as) {
    return { as: props.as }
  } else if (theme.sizes[props.size]) {
    return { as: theme.sizes[props.size].as }
  } else {
    return {}
  }
}

export const Text = styled(Box).attrs(attrs('Text', theme))(
  themed('Text', theme),
  color,
  fontSize,
  fontWeight,
  lineHeight,
  textAlign
)
