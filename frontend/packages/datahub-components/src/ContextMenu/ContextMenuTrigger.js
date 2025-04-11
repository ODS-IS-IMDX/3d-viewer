// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'

export type ContextMenuTriggerProps = {
  children: React.Node,
  location: string,
  openByClick?: boolean,
  openByMouseOver?: boolean,
  menu: (props: { position: {}, onClose: () => void }) => void
}

type State = {
  isOpen: boolean,
  position: {
    top?: number,
    left?: number,
    right?: number,
    bottom?: number
  }
}

export class ContextMenuTrigger extends React.PureComponent<
  ContextMenuTriggerProps,
  State
> {
  state = {
    isOpen: false,
    position: {}
  }

  open = (event: SyntheticEvent<>) => {
    const width = 150
    const resizerWidth = 20
    const contextWidth = 40
    event.stopPropagation()
    const { clientWidth, clientHeight } = document.documentElement || {}
    // $FlowFixMe
    const { top, right } = event.target.getBoundingClientRect()

    const { location } = this.props

    let position = {}
    if (location === 'right') {
      if (right > width) {
        position = {
          top: 50,
          left: right - width + resizerWidth
        }
      } else {
        position = {
          top: 50,
          left: right - contextWidth
        }
      }
    } else {
      position = {
        right: clientWidth - right + 5,
        bottom: clientHeight - top + 5
      }
    }

    this.setState({
      isOpen: true,
      position
    })
  }

  close = () => {
    this.setState({ isOpen: false })
  }

  render () {
    const { openByClick = true, openByMouseOver = false } = this.props
    return (
      <React.Fragment>
        <div
          style={{ fontSize: '0' }}
          onClick={openByClick ? this.open : null}
          onMouseOver={openByMouseOver ? this.open : null}
          onMouseLeave={openByMouseOver ? this.close : null}
        >
          {this.props.children}
        </div>
        {this.state.isOpen &&
          this.props.menu({
            position: this.state.position,
            onClose: this.close.bind(this)
          })}
      </React.Fragment>
    )
  }
}

export default ContextMenuTrigger
