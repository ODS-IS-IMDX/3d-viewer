// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { themed } from '@ehv/design-system'

import theme from './theme'

export type CompassInnerTargetProps = {}

const CompassInnerTargetWrapper = styled.svg`
  height: 34px;
  width: 34px;
  position: absolute;
  cursor: pointer;

  ${// $FlowFixMe
  themed('MapNavigator.Compass.InnerTarget', theme.Compass.InnerTarget)}
`

export function CompassInnerTargetRing ({ ...props }: CompassInnerTargetProps) {
  return (
    <CompassInnerTargetWrapper {...props}>
      <g data-name='compass target pressed'>
        <g data-name='Ellipse 1406' transform='translate(2 2)' fill='none'>
          <circle cx='15' cy='15' r='15' stroke='none' />
          <circle cx='15' cy='15' r='16' fill='none' />
        </g>
        <g data-name='Group 20721'>
          <path
            data-name='Union 55'
            d='M16.235 27v-3.9a6.166 6.166 0 0 1-5.335-5.331H7v-1.537h3.894a6.166 6.166 0 0 1 5.341-5.338V7h1.537v3.9a6.166 6.166 0 0 1 5.328 5.332H27v1.537h-3.9a6.169 6.169 0 0 1-5.328 5.331V27zM17 21.616a4.615 4.615 0 0 0 .17-9.228h-.34a4.618 4.618 0 0 0-4.441 4.438v.341A4.62 4.62 0 0 0 17 21.616z'
            fill='#fff'
          />
        </g>
      </g>
    </CompassInnerTargetWrapper>
  )
}

export default CompassInnerTargetRing
