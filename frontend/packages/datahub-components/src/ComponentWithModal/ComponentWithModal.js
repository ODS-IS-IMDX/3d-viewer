// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'

type State = {
  isModalOpen: boolean
}

export type ComponentWithModalProps = {
  close: () => void
}

export class ComponentWithModal extends React.PureComponent<*, State> {
  state = {
    isModalOpen: false
  }

  openModal = () => this.setState({ isModalOpen: true })
  closeModal = () => this.setState({ isModalOpen: false })

  render () {
    const { modal, children, ...props } = this.props
    return (
      <>
        {this.state.isModalOpen ? (
          <>
            {children({
              isModalOpen: this.state.isModalOpen,
              openModal: () => {},
              onClick: this.closeModal,
              ...props
            })}
            {modal({ close: this.closeModal })}
          </>
        ) : (
          <>
            {children({
              isModalOpen: this.state.isModalOpen,
              openModal: this.openModal,
              ...props
            })}
          </>
        )}
      </>
    )
  }
}
