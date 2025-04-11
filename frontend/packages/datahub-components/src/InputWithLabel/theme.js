// Copyright (c) 2025 NTT InfraNet
// @flow
import { type Theme } from '@ehv/design-system'

export type InputWithLabelTheme = {
  ...Theme,
  Label: Theme
}

export const inputWithLabelTheme: InputWithLabelTheme = {
  Label: {
    color: '#8e96a0',
    fontSize: 12,
    fontWeight: 400,
    lineHeight: '1.25'
  }
}

export default inputWithLabelTheme
