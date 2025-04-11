// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'

export type ModalControllerProps = {
  children: (open: () => void) => React.Node,
  modal: (props: { onClose: () => void }) => void,
  isOpen: boolean
}

type State = {
  index: number,
  isOpen: boolean
}

export class ModalController extends React.PureComponent<
  ModalControllerProps,
  State
> {
  constructor (props: ModalControllerProps) {
    super(props)

    this.state = {
      index: 0,
      isOpen: props.isOpen || false
    }
  }

  open = (index: number = 0) =>
    this.setState({
      index,
      isOpen: true
    })

  close = () => this.setState({ isOpen: false })

  render () {
    const { children, modal } = this.props
    const { isOpen, index } = this.state

    if (Array.isArray(modal)) {
      return (
        <React.Fragment>
          {children(modal.map((_, index) => () => this.open(index)))}
          {isOpen && modal[index]({ onClose: this.close })}
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        {children(this.open)}
        {isOpen && modal({ onClose: this.close })}
      </React.Fragment>
    )
  }
}

export default ModalController
