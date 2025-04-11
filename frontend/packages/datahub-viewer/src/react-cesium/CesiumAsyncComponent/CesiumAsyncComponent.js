// Copyright (c) 2025 NTT InfraNet
import React from 'react'

import {
  attachEvents,
  detachEvents,
  updateEvents,
  getEventProps
} from '../CesiumComponent/CesiumComponent'

export class CesiumAsyncComponent extends React.PureComponent {
  constructor (props) {
    super(props)
    this.element = null
    this.mounted = null
  }

  componentDidMount () {
    this.create()
  }

  componentWillUnmount () {
    this.unmount()
  }

  componentDidUpdate (prevProps) {
    // Update events
    updateEvents(
      this.element,
      getEventProps(this.props.cesiumEvents, prevProps),
      getEventProps(this.props.cesiumEvents, this.props)
    )
    // If any read only prop changed, then remount
    if (
      this.props.cesiumReadOnlyProps.find(
        prop => prevProps[prop] !== this.props[prop]
      )
    ) {
      this.unmount()
      this.create()
      return
    }
    // Update all other props if change
    this.props.cesiumProps
      .filter(prop => prevProps[prop] !== this.props[prop])
      .forEach(prop => (this.element[prop] = this.props[prop]))
  }

  create () {
    // 非同期
    this.props.create().then(v => {
      this.element = v

      // set non-constructor props on element
      this.props.cesiumProps
        .filter(
          prop => this.props[prop] && this.element[prop] !== this.props[prop]
        )
        .forEach(prop => (this.element[prop] = this.props[prop]))

      attachEvents(
        this.element,
        getEventProps(this.props.cesiumEvents, this.props)
      )

      this.mount()
    })
  }

  mount () {
    this.mounted = this.props.mount(this.element)
    if (this.props.onMount) {
      this.props.onMount(this.element, this.mounted)
    }
    if (this.mounted) {
      this.forceUpdate()
    }
  }

  unmount () {
    if (this.props.onUnmount) {
      this.props.onUnmount(this.element, this.mounted)
    }
    this.props.unmount(this.element, this.mounted)
    detachEvents(
      this.element,
      getEventProps(this.props.cesiumEvents, this.props)
    )
  }

  render () {
    return this.element && this.props.children
      ? typeof this.props.children === 'function'
        ? this.props.children(this.element, this.mounted)
        : this.props.children
      : null
  }
}

CesiumAsyncComponent.defaultProps = {
  mount: () => {},
  create: () => {},
  unmount: () => {},
  cesiumProps: [],
  cesiumEvents: [],
  cesiumReadOnlyProps: []
}
