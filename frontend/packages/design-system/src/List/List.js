// Copyright (c) 2025 NTT InfraNet
import styled from 'styled-components'
import {
  lineHeight,
  width,
  borders,
  borderColor,
  boxShadow,
  borderRadius
} from 'styled-system'

import { themed } from '../utils'

export const List = styled.ul`
  border: 0;
  margin: 0;
  padding: 0;
  display: block;

  color: #3a4248;

  ${lineHeight}
  ${borders}
  ${borderColor}
  ${boxShadow}
  ${borderRadius}
  ${themed('List')}
`

List.propTypes = {
  ...lineHeight.propTypes,
  ...width.propTypes,
  ...borders.propTypes,
  ...borderColor.propTypes,
  ...boxShadow.propTypes,
  ...borderRadius.propTypes
}

List.defaultProps = {
  fontSize: '16px',

  bg: '#f6f6f6',
  px: 3,
  py: 3
}

export const ListItem = styled.li`
  display: block;
`

List.Item = ListItem
