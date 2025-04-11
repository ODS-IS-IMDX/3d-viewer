// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { PureComponent, type Node } from 'react'
import styled from 'styled-components'
import { themed } from '@ehv/design-system'

import theme from './theme'
import DrawerResizer from './DrawerResizer'
import DrawerContent from './DrawerContent'

export const DrawerWrapper = styled.div`
  display: flex;
  flex-direction: column;

  bottom: 0;
  width: 100%;
  position: absolute;

  ${// $FlowFixMe
  ({ resizing }) => !resizing && `transition: height 0.5s ease 0s;`}

  ${// $FlowFixMe
  themed('Drawer', theme)}
`

export type DrawerProps = {
  height: number,
  snapping: Array<number>,
  children?: Node,
  /** 最小化フラグ */
  isMinimum?: boolean
}

type State = {
  /** ドロワーの高さ */
  height: number,
  /** 最小化直前の高さ */
  heightBeforeMin: number,
  resizing: boolean
}

export class Drawer extends PureComponent<DrawerProps, State> {
  static defaultProps = {
    height: 300,
    isMinimum: false
  }

  state: State = {
    resizing: false,
    height: 0,
    heightBeforeMin: 0
  }

  wrapper = React.createRef<HTMLDivElement>()
  resizer = React.createRef<HTMLDivElement>()
  content = React.createRef<HTMLDivElement>()

  calculate = (event: PointerEvent, snap: boolean = false): number => {
    if (!this.resizer.current) {
      return this.state.height
    }
    const resizer = this.resizer.current.getBoundingClientRect()
    if (!this.wrapper.current || !this.wrapper.current.parentElement) {
      return this.state.height
    }
    const parent = this.wrapper.current.parentElement.getBoundingClientRect()
    const height = parent.height - event.pageY + parent.top + resizer.height / 2
    if (snap && this.props.snapping && this.props.snapping.length) {
      const snapped = this.props.snapping
        .map(ratio => ratio * parent.height)
        .reduce((prev, curr) =>
          Math.abs(curr - height) < Math.abs(prev - height) ? curr : prev
        )
      return Math.max(Math.min(snapped, parent.height), resizer.height)
    }
    return Math.max(Math.min(height, parent.height), resizer.height)
  }

  correctIncommingHeight (height: number) {
    if (this.props.isMinimum) {
      // 最小化状態
      let minimumHeight = 0
      if (this.resizer && this.resizer.current) {
        minimumHeight = this.resizer.current.getBoundingClientRect().height
      }
      return minimumHeight
    }

    if (
      !this.resizer.current ||
      !this.wrapper.current ||
      !this.wrapper.current.parentElement
    ) {
      // In the first render the refs are not setted up, this section uses a percentage for the first height calculation.
      if (this.props.snapping && this.props.snapping.length) {
        const minRatio = this.props.snapping.reduceRight(
          (accumulator, snap) =>
            accumulator === 0 ? snap : Math.min(snap, accumulator),
          0
        )

        return `${minRatio * 100}%`
      }

      return height
    }

    const parent = this.wrapper.current.parentElement.getBoundingClientRect()

    if (this.props.snapping && this.props.snapping.length) {
      const maxRatio = 0.5
      const minRatio = this.props.snapping.reduceRight(
        (accumulator, snap) =>
          accumulator === 0 ? snap : Math.min(snap, accumulator),
        0
      )

      const superiorLimit = maxRatio * parent.height
      const inferiorLimit = minRatio * parent.height

      return height < inferiorLimit
        ? inferiorLimit
        : height > superiorLimit
        ? superiorLimit
        : height
    }

    return height
  }

  onPointerDown = () => {
    document.addEventListener('pointerup', this.onPointerUp)
    document.addEventListener('pointermove', this.onPointerMove, {
      passive: false
    })
    this.setState({
      resizing: true
    })
  }

  onPointerUp = (event: PointerEvent) => {
    document.removeEventListener('pointerup', this.onPointerUp)
    document.removeEventListener('pointermove', this.onPointerMove)
    // snapping was temporary disabled for UX reasons, to re-enable it, call next this.calculate like this: `this.calculate(event, true)`. Also consider refactoring this.calculate to not take boolean as argument
    const newHeight = this.calculate(event)
    this.setState({
      resizing: false,
      height: newHeight,
      heightBeforeMin: newHeight
    })
  }

  onPointerMove = (event: PointerEvent) => {
    event.preventDefault() // prevents body scroll on ipad

    this.setState({
      height: this.calculate(event)
    })
  }

  componentDidUpdate (preProps: DrawerProps, preState: State) {
    if (preProps.isMinimum !== this.props.isMinimum) {
      // isMinimum=trueで最小化させる
      let minimumHeight = 0
      if (this.resizer && this.resizer.current) {
        minimumHeight = this.resizer.current.getBoundingClientRect().height
      }
      this.setState({
        height: this.props.isMinimum
          ? minimumHeight
          : this.state.heightBeforeMin
      })
    }
  }

  componentWillUnmount () {
    document.removeEventListener('pointerup', this.onPointerUp)
    document.removeEventListener('pointermove', this.onPointerMove)
  }

  render () {
    const height = this.state.height
      ? this.state.height
      : this.correctIncommingHeight(this.props.height)
    const { resizing } = this.state

    return (
      <DrawerWrapper ref={this.wrapper} resizing={resizing} style={{ height }}>
        <DrawerResizer
          ref={this.resizer}
          onPointerDown={this.onPointerDown}
          style={{ touchAction: 'none' }}
        />
        <DrawerContent ref={this.content}>{this.props.children}</DrawerContent>
      </DrawerWrapper>
    )
  }
}

export default Drawer
