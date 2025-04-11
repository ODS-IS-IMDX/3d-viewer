// Copyright (c) 2025 NTT InfraNet
// @flow
import { type Theme } from '@ehv/design-system'

export type ContextMenuTheme = {
  ...Theme,
  Item: Theme,
  Divider: Theme
}

export const contextMenuTheme: ContextMenuTheme = {
  backgroundColor: '#ffffff',
  Item: {
    states: {
      hover: {
        backgroundColor: '#f6f6f6'
      }
    },
    Label: {
      variants: {
        alert: {
          color: '#ed4f5b'
        }
      }
    }
  },
  Divider: {
    border: 'solid 1px #f6f6f6'
  }
}

export default contextMenuTheme
