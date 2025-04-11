// Copyright (c) 2025 NTT InfraNet
// @flow
import { type Theme } from '@ehv/design-system'

export type ItemsCarouselTheme = {
  ...Theme,

  Item: {
    ...Theme
  }
}

export const itemsCarouselTheme: ItemsCarouselTheme = {
  Item: {}
}

export default itemsCarouselTheme
