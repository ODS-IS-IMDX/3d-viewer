// Copyright (c) 2025 NTT InfraNet
// @flow
import { type Theme } from '@ehv/design-system'

export type MapMoreTheme = Theme

export const mapMoreTheme: MapMoreTheme = {
  opacity: 0.75,

  circle: {
    opacity: 1
  },
  states: {
    hover: {
      opacity: '1 !important'
    },
    active: {
      opacity: '1 !important',

      circle: {
        fill: '#16abe3'
      }
    }
  }
}

export default mapMoreTheme
