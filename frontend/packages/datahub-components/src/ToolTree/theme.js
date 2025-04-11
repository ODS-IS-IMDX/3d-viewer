// Copyright (c) 2025 NTT InfraNet
// @flow
import { type Theme } from '@ehv/design-system'

export type ToolTreeTheme = {
  ...Theme,
  DisabledIcon: Theme,
  DisabledText: Theme,
  EnabledIcon: Theme
}

export const toolTreeTheme: ToolTreeTheme = {
  DisabledIcon: {
    backgroundColor: '#e0e0e0'
  },
  DisabledText: {
    color: '#8e96a0'
  },
  EnabledIcon: {
    backgroundColor: '#16abe3'
  }
}

export default toolTreeTheme
