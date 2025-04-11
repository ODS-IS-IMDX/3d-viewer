// Copyright (c) 2025 NTT InfraNet
// @flow
import { type Theme } from '@ehv/design-system'

export type GridTheme = {
  ...Theme,
  Item: {
    ...Theme
  }
}

export const gridTheme: GridTheme = {
  Item: {
    borderRadius: 6,
    states: {
      hover: {
        backgroundColor: '#f6f6f6'
      }
    }
  }
}

export default gridTheme
