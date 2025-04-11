// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { Slot } from '@ehv/react-slots'
import { Flex, Accordion } from '@ehv/datahub-components'
import { themed } from '@ehv/design-system'

import type { SiteMenuProps } from './'
import theme from './theme'
import { SideBar } from '../SideBar'
import SiteMenuMobile from './SiteMenuMobile'
import SiteMenuResizer from './SiteMenuResizer'
import { FileNumberPanel } from 'plugins/file/components/FileNumberPanel'
import SideMenuHeader from '../SideMenuHeader'

// $FlowFixMe
const SiteMenuWrapper = styled(Flex)`
  height: 100%;
  flex-direction: row;
  background-color: white;

  @media only screen and (device-width: 768px) {
    /* For general iPad layouts */
    height: calc(100vh - 60px);
  }

  ${// $FlowFixMe
  ({ resizing }) => !resizing && `transition: width 0.5s ease 0s;`}

  ${// $FlowFixMe
  themed('SiteMenu', theme)}
`
const SiteMenuPanelWrapper = styled(Flex)`
  background-color: #fafafa;
  flex-direction: column;
`

type State = {
  width: number,
  resizing: boolean
}

const MIN_WIDTH = 240

export class SiteMenu extends PureComponent<SiteMenuProps, State> {
  static defaultProps = {
    width: MIN_WIDTH
  }

  state = {
    resizing: false,
    width: 0
  }

  wrapper = React.createRef<HTMLDivElement>()
  resizer = React.createRef<HTMLDivElement>()

  calculateByMoveResizer = (
    event: PointerEvent,
    snap: boolean = false
  ): number => {
    // サイドバーの幅を考慮した数値
    const MAX_WIDTH = window.innerWidth * 0.5 - 70

    if (!this.resizer.current) {
      return this.state.width
    }
    const resizer = this.resizer.current.getBoundingClientRect()
    if (!this.wrapper.current || !this.wrapper.current.parentElement) {
      return this.state.width
    }
    let width =
      event.pageX < window.innerWidth
        ? event.pageX - resizer.width / 2
        : window.innerWidth
    width -= 70 // サイドバー分調整
    if (snap && this.props.snapping && this.props.snapping.length) {
      const snapped = this.props.snapping
        .map(ratio => ratio * window.innerWidth)
        .reduce((prev, curr) =>
          Math.abs(curr - width) < Math.abs(prev - width) ? curr : prev
        )
      return Math.max(Math.min(snapped, window.innerWidth), resizer.width)
    }
    return Math.max(Math.min(width, MAX_WIDTH), MIN_WIDTH)
  }

  calculateByResizeWindow = (): number => {
    // サイドバーの幅を考慮した数値
    const MAX_WIDTH = window.innerWidth * 0.5 - 70
    const { width } = this.state

    return Math.max(Math.min(width, MAX_WIDTH), MIN_WIDTH)
  }

  correctIncomingWidth (width: number) {
    if (
      !this.resizer.current ||
      !this.wrapper.current ||
      !this.wrapper.current.parentElement
    ) {
      // In the first render the refs are not setted up, this section uses a percentage for the first width calculation.
      if (this.props.snapping && this.props.snapping.length) {
        const minRatio = this.props.snapping.reduceRight(
          (accumulator, snap) =>
            accumulator === 0 ? snap : Math.min(snap, accumulator),
          0
        )

        return `${minRatio * 100}%`
      }

      return width
    }

    if (this.props.snapping && this.props.snapping.length) {
      const maxRatio = 0.5
      const minRatio = this.props.snapping.reduceRight(
        (accumulator, snap) =>
          accumulator === 0 ? snap : Math.min(snap, accumulator),
        0
      )

      const superiorLimit = maxRatio * window.innerWidth
      const inferiorLimit = minRatio * window.innerWidth

      return width < inferiorLimit
        ? inferiorLimit
        : width > superiorLimit
        ? superiorLimit
        : width
    }

    return width
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
    this.setState({
      resizing: false,
      // snapping was temporary disabled for UX reasons, to re-enable it, call next this.calculateByMoveResizer like this: `this.calculateByMoveResizer(event, true)`. Also consider refactoring this.calculateByMoveResizer to not take boolean as argument
      width: this.calculateByMoveResizer(event)
    })
  }

  onPointerMove = (event: PointerEvent) => {
    event.preventDefault() // prevents body scroll on ipad

    this.setState({
      width: this.calculateByMoveResizer(event)
    })
  }

  onWindowResize = () => {
    this.setState({
      width: this.calculateByResizeWindow()
    })
  }

  componentDidMount () {
    if (this.props.isMobile) {
      return
    }
    window.addEventListener('resize', this.onWindowResize)
  }

  componentWillUnmount () {
    if (this.props.isMobile) {
      return
    }
    document.removeEventListener('pointerup', this.onPointerUp)
    document.removeEventListener('pointermove', this.onPointerMove)
    window.removeEventListener('resize', this.onWindowResize)
  }

  render () {
    const { onlyLogoRow, children, activeIconName, isMobile } = this.props
    if (isMobile) {
      return <SiteMenuMobile {...this.props} />
    }

    let width = 0
    if (activeIconName != null) {
      width = this.state.width
        ? this.state.width
        : this.correctIncomingWidth(this.props.width)
    }
    const { resizing } = this.state

    return (
      <SiteMenuWrapper ref={this.wrapper} resizing={resizing}>
        <SideBar />
        <>
          <Slot name='site.menu'>
            {fills => {
              return (
                <>
                  <SiteMenuPanelWrapper
                    style={{
                      width,
                      transition: resizing ? '0s' : '0.3s'
                    }}
                  >
                    {!onlyLogoRow && (
                      <Accordion
                        variant='menu'
                        multiple
                        style={{
                          height: '100%',
                          overflowX: 'auto',
                          overflowY: 'auto'
                        }}
                      >
                        <SideMenuHeader />
                        {fills
                          .filter(fill => fill.props.type === activeIconName)
                          .sort(
                            (
                              { props: { order: a = Number.MAX_VALUE } },
                              { props: { order: b = Number.MAX_VALUE } }
                            ) => a - b
                          )
                          .map(fill => fill.render())}
                      </Accordion>
                    )}
                    {children}
                    <FileNumberPanel />
                  </SiteMenuPanelWrapper>
                </>
              )
            }}
          </Slot>
          {activeIconName != null && (
            <SiteMenuResizer
              ref={this.resizer}
              onPointerDown={this.onPointerDown}
              style={{ touchAction: 'none' }}
            />
          )}
        </>
      </SiteMenuWrapper>
    )
  }
}

export default SiteMenu
