// Copyright (c) 2025 NTT InfraNet
// @flow
import { type Theme } from '@ehv/design-system'

export type CustomRadioTheme = {
  ...Theme,
  Selected: Theme
}

export const customRadioTheme: CustomRadioTheme = {
  color: '#000',
  backgroundColor: '#fff',
  Selected: {
    color: '#fff',
    backgroundColor: '#15aae3'
  }
}

export default customRadioTheme
