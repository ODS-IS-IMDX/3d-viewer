// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { useEffect, useRef, memo } from 'react'
import { DataSet, Timeline as VisTimeline } from 'vis-timeline/standalone'

type TimelineProps = {
  event?: Object,
  afterInit?: () => void,
  beforeDestroy?: () => void,
  outputInstance?: Object => void,
  groups?: Array<Object>,
  items: null | Array<Object>,
  options?: Object
}

const TIMELINE_EVENT_NAMES = [
  'currentTimeTick',
  'click',
  'contextmenu',
  'doubleClick',
  'dragover',
  'drop',
  'mouseOver',
  'mouseDown',
  'mouseUp',
  'mouseMove',
  'groupDragged',
  'changed',
  'rangechange',
  'rangechanged',
  'select',
  'itemover',
  'itemout',
  'timechange',
  'timechanged',
  'markerchange',
  'markerchanged'
]

const TimelineComponent = (props: TimelineProps) => {
  const {
    event = {},
    afterInit,
    beforeDestroy,
    outputInstance,
    groups,
    items,
    options = {}
  } = props
  const ref = useRef<HTMLDivElement>(null)
  let component

  const initComponent = () => {
    component = new VisTimeline(ref.current, null, options)
    component.setItems(new DataSet(items))
    groups && component.setGroups(groups)
    typeof event === 'object' &&
      Object.keys(event).forEach(eventName => {
        if (
          TIMELINE_EVENT_NAMES.includes(eventName) &&
          typeof event[eventName] === 'function'
        ) {
          component.on(eventName, event[eventName])
        }
      })
    typeof outputInstance === 'function' && outputInstance(component)
    typeof afterInit === 'function' && afterInit()
  }
  const destroyComponent = () => {
    typeof beforeDestroy === 'function' && beforeDestroy()
    component.destroy()
  }

  useEffect(() => {
    initComponent()
    return () => {
      destroyComponent()
    }
  })

  return <div ref={ref} />
}

export const Timeline = memo<TimelineProps>(TimelineComponent)
export { DataSet }
