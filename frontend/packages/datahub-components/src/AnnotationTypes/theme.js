// Copyright (c) 2025 NTT InfraNet
// @flow
import { type Theme } from '@ehv/design-system'

export type AnnotationTypesTheme = {
  Wrapper: Theme,
  Icon: Theme,
  SelectedIcon: Theme
}

export const analyticInfoTileTheme: AnnotationTypesTheme = {
  Wrapper: {
    border: 'solid 1px #e1e6eb'
  },
  Icon: {
    background: '#ffffff'
  },
  SelectedIcon: {
    background: '#16abe3'
  }
}

export default analyticInfoTileTheme
