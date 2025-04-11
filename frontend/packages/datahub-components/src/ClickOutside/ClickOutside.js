// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'

type ClickOutsideProps = {
  children: Array<React.Node> | React.Node,
  onClickOutside: PointerEvent => void
}

export class ClickOutside extends React.PureComponent<ClickOutsideProps> {
  constructor (props: ClickOutsideProps) {
    super(props)

    this.setWrapperRef = this._setWrapperRef.bind(this)
    this.handleClickOutside = this._handleClickOutside.bind(this)
  }

  componentDidMount () {
    // $FlowFixMe - pointer events not handled properly
    document.addEventListener('pointerdown', this.handleClickOutside)
  }

  componentWillUnmount () {
    // $FlowFixMe - pointer events not handled properly
    document.removeEventListener('pointerdown', this.handleClickOutside)
  }

  wrapperRef: ?HTMLDivElement

  setWrapperRef: ?(?HTMLDivElement) => void

  _setWrapperRef (ref: ?HTMLDivElement) {
    this.wrapperRef = ref
  }

  handleClickOutside: ?(?PointerEvent) => void

  _handleClickOutside (event: PointerEvent) {
    // $FlowFixMe - .contains only expects a Node type but should allow EventTarget too
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.onClickOutside(event)
    }
  }

  render () {
    return <div ref={this.setWrapperRef}>{this.props.children}</div>
  }
}
