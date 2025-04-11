// Copyright (c) 2025 NTT InfraNet
// @flow
import styled from 'styled-components'
import { themed } from '@ehv/design-system'

import theme from './theme'

import List from '../List'
import SelectListItem from './SelectListItem'

export const SelectList = styled(List)`
  ${// $FlowFixMe
  themed('SelectList', theme)}
`

SelectList.Item = SelectListItem

export default SelectList
