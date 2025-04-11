// Copyright (c) 2025 NTT InfraNet
// @flow
import { type Theme } from '@ehv/design-system'

export type DrawerTheme = {
  ...Theme,
  Resizer: Theme,
  Content: Theme
}

export const drawerTheme: DrawerTheme = {
  Resizer: {
    backgroundColor: 'white',
    named: {
      snap: {
        backgroundColor: '#e2e2e2'
      }
    }
  },
  Content: {
    backgroundColor: 'white'
  }
}

export default drawerTheme
