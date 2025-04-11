// Copyright (c) 2025 NTT InfraNet
import styled from 'styled-components'
import {
  alignSelf,
  color,
  display,
  flex,
  fontSize,
  height,
  maxHeight,
  maxWidth,
  minHeight,
  minWidth,
  order,
  space,
  textAlign,
  width
} from 'styled-system'

import { themed } from '../utils'

export const Box = styled.div(
  {
    boxSizing: 'border-box'
  },
  alignSelf,
  color,
  display,
  flex,
  // size,
  fontSize,
  height,
  maxHeight,
  maxWidth,
  minHeight,
  minWidth,
  order,
  space,
  textAlign,
  width,
  themed('Box')
)

Box.propTypes = {
  ...alignSelf.propTypes,
  ...color.propTypes,
  ...display.propTypes,
  ...flex.propTypes,
  ...fontSize.propTypes,
  ...height.propTypes,
  ...maxHeight.propTypes,
  ...maxWidth.propTypes,
  ...minHeight.propTypes,
  ...minWidth.propTypes,
  ...order.propTypes,
  ...space.propTypes,
  ...textAlign.propTypes,
  ...width.propTypes
}
