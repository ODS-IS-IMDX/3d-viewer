// Copyright (c) 2025 NTT InfraNet
// @flow
import { type Theme } from '@ehv/design-system'

export type SideMenuHeaderTheme = {
  ...Theme,
  Default: Theme
}

export const sideMenuHeaderTheme: SideMenuHeaderTheme = {
  Default: {
    borderBottom: '1px solid #187ABC'
  }
}

export default sideMenuHeaderTheme
