// Copyright (c) 2025 NTT InfraNet
// @flow
import { type Theme } from '@ehv/design-system'

export type AnalyticInfoTileTheme = {
  TileWrapper: Theme,
  Title: Theme,
  Value: Theme
}

export const analyticInfoTileTheme: AnalyticInfoTileTheme = {
  TileWrapper: {
    borderBottom: 'solid 1px #ecf0f3',
    borderRight: 'solid 1px #ecf0f3'
  },
  Title: {
    lineHeight: '1.29',
    fontWeight: 600,
    color: '#606770'
  },
  Value: {
    lineHeight: '1.25',
    color: '#606770'
  }
}

export default analyticInfoTileTheme
