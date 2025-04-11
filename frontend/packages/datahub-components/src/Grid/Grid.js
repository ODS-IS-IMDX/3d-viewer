// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { Grid as BaseGrid, themed } from '@ehv/design-system'

import theme from './theme'
import GridItem from './GridItem'

export const GridWrapper = styled(BaseGrid)`
  ${// $FlowFixMe
  themed('Grid', theme)}
`

export type GridProps = {
  variant: string,
  children: React.ChildrenArray<React.Element<typeof GridItem>>
}

export class Grid extends React.PureComponent<GridProps> {
  static Item = GridItem

  render () {
    const { children, ...props } = this.props
    return (
      <GridWrapper {...props}>
        {React.Children.map(
          children,
          (child, index) =>
            child &&
            React.cloneElement(child, {
              index: index,
              variant: props.variant
            })
        )}
      </GridWrapper>
    )
  }
}
