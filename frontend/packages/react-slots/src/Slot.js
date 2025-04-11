// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import { Consumer, type FillProps } from './Context'

export type SlotProps = {
  name: string,
  onFills: (fills: Array<FillProps>) => void,
  children?: (
    fills: Array<{ props: FillProps, render: (extra: {}) => React.Node }>
  ) => React.Node
}

export type SlotInnerProps = {
  ...$Exact<SlotProps>,
  fillsById: {
    [id: number]: FillProps
  }
}

export class Slot extends React.PureComponent<SlotInnerProps> {
  componentDidMount () {
    if (this.props.fillsById) {
      const fills: Array<FillProps> = (Object.values(this.props.fillsById): any)
      this.props.onFills(fills)
    }
  }

  componentDidUpdate (prevProps: SlotInnerProps) {
    if (!Object.is(prevProps.fillsById, this.props.fillsById)) {
      const fills: Array<FillProps> = (Object.values(this.props.fillsById): any)
      this.props.onFills(fills)
    }
  }

  render () {
    const { fillsById = {}, children, onFills, ...props } = this.props
    const fills: Array<FillProps> = (Object.values(fillsById): any)

    if (typeof children === 'function') {
      return children(
        fills.map((fill: FillProps, index) => ({
          props: fill,
          render: (extra = {}) =>
            fill.children
              ? typeof fill.children === 'function'
                ? fill.children({ ...props, ...extra })
                : fill.children
              : null
        }))
      )
    }

    return fills.map<React.Node>((fill: FillProps, index) =>
      fill.children ? (
        typeof fill.children === 'function' ? (
          <React.Fragment key={index}>{fill.children(props)}</React.Fragment>
        ) : (
          fill.children
        )
      ) : null
    )
  }
}

export const SlotContainer = (props: SlotProps) => (
  <Consumer>
    {({ slots }) => <Slot {...props} fillsById={slots[props.name]} />}
  </Consumer>
)

SlotContainer.defaultProps = {
  onFills: () => {}
}

export default SlotContainer
