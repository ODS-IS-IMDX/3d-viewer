// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { themed } from '@ehv/design-system'
import { BaseStyle } from '../Style'

import theme from './theme'
import ListItem from './ListItem'

export const ListWrapper = styled.div`
  ${props =>
    !props.isMobile ? BaseStyle : 'overflow-x: overlay; overflow-y: overlay;'}

  display: flex;
  flex-direction: column;
  ${// $FlowFixMe
  themed('List', theme)}
`

export type ListProps = {
  variant: 'default' | 'menu' | 'drawer' | 'modal' | 'list',
  children: React.ChildrenArray<React.Element<typeof ListItem>>
}

export class List extends React.PureComponent<ListProps> {
  static Item = ListItem

  render () {
    const { children, ...props } = this.props
    return (
      <ListWrapper {...props}>
        {React.Children.map(
          children,
          (child, index) =>
            child &&
            React.cloneElement(child, {
              index: index,
              even: index % 2,
              variant: props.variant
            })
        )}
      </ListWrapper>
    )
  }
}
