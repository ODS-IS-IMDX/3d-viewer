// Copyright (c) 2025 NTT InfraNet
// @flow
import { type Theme } from '@ehv/design-system'

export type SliderTheme = {
  ...Theme,
  Label: Theme,
  Thumb: Theme
}

export const sliderTheme: SliderTheme = {
  height: '4px',
  borderRadius: '4px',
  background: '#cbd1d6',

  Label: {
    color: '#8e96a0'
  },

  Thumb: {
    cursor: 'pointer',
    width: '16px',
    height: '16px',
    borderRadius: '16px',
    background: '#16abe3',
    border: 'solid 2px #ffffff',
    boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.16)'
  }
}

export default sliderTheme
