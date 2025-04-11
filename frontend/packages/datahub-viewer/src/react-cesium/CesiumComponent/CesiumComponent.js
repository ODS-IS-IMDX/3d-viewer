// Copyright (c) 2025 NTT InfraNet
import React from 'react'

export const attachEvents = (target, events) => {
  Object.entries(events).forEach(([eventName, listener]) => {
    if (typeof listener === 'function') {
      target[eventName].addEventListener(listener)
    }
  })
}

export const detachEvents = (target, events) => {
  Object.entries(events).forEach(([eventName, listener]) => {
    if (typeof listener === 'function') {
      target[eventName].removeEventListener(listener)
    }
  })
}

export const updateEvents = (target, prevEvents, newEvents) => {
  const toDetach = Object.entries(prevEvents).reduce(
    (acc, [eventName, listener]) => {
      return !newEvents[eventName] ||
        listener !== newEvents[eventName] ||
        typeof listener !== 'function'
        ? Object.assign(acc, { [eventName]: listener })
        : acc
    },
    {}
  )

  const toAttach = Object.entries(newEvents).reduce(
    (acc, [eventName, listener]) => {
      return (!prevEvents[eventName] || listener !== prevEvents[eventName]) &&
        typeof listener === 'function'
        ? Object.assign(acc, { [eventName]: listener })
        : acc
    },
    {}
  )

  detachEvents(target, toDetach)
  attachEvents(target, toAttach)
}

export const getEventProps = (eventNames, props) => {
  return eventNames.reduce((acc, eventName) => {
    const propName = `on${eventName[0].toUpperCase()}${eventName
      .slice(1)
      .replace(/Event$/, '')}`
    const listener = props[propName]
    return typeof listener === 'function'
      ? Object.assign(acc, { [eventName]: listener })
      : acc
  }, {})
}

export class CesiumComponent extends React.PureComponent {
  constructor (props) {
    super(props)
    this.element = null
    this.mounted = null
    this.create()
  }

  componentDidMount () {
    this.mount()
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
      this.mount()
      return
    }
    // Update all other props if change
    this.props.cesiumProps
      .filter(prop => prevProps[prop] !== this.props[prop])
      .forEach(prop => (this.element[prop] = this.props[prop]))
  }

  create () {
    this.element = this.props.create()
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

CesiumComponent.defaultProps = {
  mount: () => {},
  create: () => {},
  unmount: () => {},
  cesiumProps: [],
  cesiumEvents: [],
  cesiumReadOnlyProps: []
}
