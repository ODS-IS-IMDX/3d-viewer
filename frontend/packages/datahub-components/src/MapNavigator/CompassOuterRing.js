// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { themed } from '@ehv/design-system'

import theme from './theme'

export type CompassOuterRingProps = {
  setRotation: number => void,
  rotation: number
}

const CompassOuterRingWrapper = styled.svg`
  height: 63px;
  width: 64px;

  ${// $FlowFixMe
  themed('MapNavigator.Compass.OuterRing', theme.Compass.OuterRing)}
`

// $FlowFixMe - see https://github.com/flow-typed/flow-typed/pull/3228#issuecomment-475993992
const CompassWrapper = styled.div.attrs(({ rotation }) => ({
  style: {
    transform: `rotate(${rotation}deg)`
  }
}))``

export function CompassOuterRing ({
  rotation,
  setRotation,
  ...props
}: CompassOuterRingProps) {
  const [rotating, setRotating] = React.useState(false)
  const [center, setCenter] = React.useState({
    x: 0,
    y: 0
  })

  function onStart (e) {
    const { height, top, left, width } = e.target.getBoundingClientRect()

    setCenter({
      x: left + width / 2,
      y: top + height / 2
    })
    setRotating(true)
    document.addEventListener('mouseup', onEnd)
  }

  function onRotate (e: MouseEvent) {
    if (rotating) {
      const x = e.clientX - center.x
      const y = e.clientY - center.y
      const degrees = (180 / Math.PI) * Math.atan2(y, x)
      setRotation(degrees + 90)
    }
  }

  function onEnd (e: MouseEvent) {
    setRotating(false)
    document.removeEventListener('mouseup', onEnd)
  }

  return (
    <CompassWrapper
      rotation={rotation}
      onMouseDown={onStart}
      onMouseUp={onEnd}
      onMouseMove={onRotate}
    >
      <CompassOuterRingWrapper {...props}>
        <g data-name='compass ring hover' transform='translate(-496 -2267)'>
          <circle
            data-name='Ellipse 1399'
            cx='32'
            cy='32'
            r='32'
            transform='translate(496 2267)'
          />
          <path
            data-name='Path 7317'
            d='M524.936 2269h1.81l2.039 3.886.768 1.726h.048c-.073-.827-.216-1.93-.216-2.854V2269h1.678v7.819h-1.81l-2.039-3.9-.768-1.7h-.048c.073.863.216 1.906.216 2.83v2.77h-1.678zm33.051 29.561a29.885 29.885 0 0 0-8.43-20.351l.009-.009-.707-.707-.009.009a29.9 29.9 0 0 0-15.644-7.976v2.036a27.939 27.939 0 0 1 14.221 7.363l-2.1 2.1.707.707 2.1-2.1a27.893 27.893 0 0 1 7.853 18.928H553v1h2.987a27.892 27.892 0 0 1-7.853 18.928l-2.1-2.1-.707.707 2.1 2.1a27.893 27.893 0 0 1-18.927 7.853v-2.986h-1v2.988a27.9 27.9 0 0 1-18.928-7.853l2.1-2.1-.707-.707-2.1 2.1a27.9 27.9 0 0 1-7.853-18.928H503v-1h-2.988a27.9 27.9 0 0 1 7.853-18.928l2.1 2.1.707-.707-2.1-2.1a27.941 27.941 0 0 1 14.222-7.363v-2.036a29.9 29.9 0 0 0-15.645 7.976l-.009-.009-.707.707.009.009a29.888 29.888 0 0 0-8.43 20.351H498v1h.012a29.9 29.9 0 0 0 8.429 20.352l-.008.008.343.343.021.021.343.343.009-.008a29.89 29.89 0 0 0 20.351 8.429v.012h1v-.012a29.9 29.9 0 0 0 20.351-8.429l.008.008.343-.343.021-.021.343-.343-.008-.008a29.892 29.892 0 0 0 8.429-20.352H558v-1z'
          />
        </g>
      </CompassOuterRingWrapper>
    </CompassWrapper>
  )
}

export default CompassOuterRing
