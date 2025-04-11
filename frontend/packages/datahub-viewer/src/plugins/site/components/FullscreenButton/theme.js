// Copyright (c) 2025 NTT InfraNet
// @flow
import { type Theme } from '@ehv/design-system'

export type FullscreenButtonTheme = {
  ...Theme,
  Button: Theme,
  Icon: Theme
}

export const fullscreenButtonTheme: FullscreenButtonTheme = {
  Button: {
    backgroundColor: '#000',
    opacity: 0.75,
    borderRadius: '50%',
    height: 45,
    width: 45,
    states: {
      hover: {
        backgroundColor: '#000',
        opacity: 1
      },
      active: {
        backgroundColor: '#16abe3'
      }
    }
  },
  Icon: {
    display: 'block',
    position: 'absolute',
    width: 45,
    height: 45,
    padding: 6,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    verticalAlign: 'middle',
    boxSizing: 'border-box'
  }
}

export default fullscreenButtonTheme
