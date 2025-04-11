// Copyright (c) 2025 NTT InfraNet
// @flow
import { type Theme } from '@ehv/design-system'

export type InputTheme = {
  ...Theme,
  Label: Theme,
  Error: Theme
}

export const inputTheme: InputTheme = {
  width: '100%',

  states: {
    disabled: {
      borderBottom: 0,
      color: '#8e96a0'
    }
  },

  Label: {
    color: '#b2b9c1',
    fontSize: 12,
    fontWeight: 400,
    lineHeight: '1.25'
  },
  Error: {
    color: '#ed4f5b'
  }
}

export default inputTheme
