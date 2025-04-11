// Copyright (c) 2025 NTT InfraNet
import styled from 'styled-components'
import {
  color,
  fontSize,
  fontWeight,
  lineHeight,
  textAlign
} from 'styled-system'

import Text from '../Text'
import { themed } from '../utils'

export const OverflowEllipsis = styled(Text)(
  {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },

  color,
  fontSize,
  fontWeight,
  lineHeight,
  textAlign,
  themed('Text')
)

OverflowEllipsis.propTypes = {
  ...color.propTypes,
  ...fontSize.propTypes,
  ...fontWeight.propTypes,
  ...lineHeight.propTypes,
  ...textAlign.propTypes
}
