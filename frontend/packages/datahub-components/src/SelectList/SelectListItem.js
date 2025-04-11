// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { Checkbox, themed } from '@ehv/design-system'

import theme from './theme'
import List, { type ListItemProps } from '../List'

type SelectListItemProps = {
  selected: boolean,
  onChange: boolean => void,
  children: React.Node,
  ...$Exact<ListItemProps>
}

export const SelectListItemWrapper = styled(List.Item)`
  ${// $FlowFixMe
  themed('SelectList.Item', theme.Item)}
`

export class SelectListItem extends React.PureComponent<SelectListItemProps> {
  onClick = () => {
    this.props.onChange(!this.props.selected)
  }

  render () {
    const { onChange, children, ...props } = this.props
    return (
      <SelectListItemWrapper {...props} onClick={this.onClick}>
        <Checkbox mx={12} variant='round' checked={!!props.selected} readOnly />
        {children}
      </SelectListItemWrapper>
    )
  }
}

export default SelectListItem
