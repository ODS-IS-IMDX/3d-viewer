// Copyright (c) 2025 NTT InfraNet
// @flow
import { type ListTheme } from '../List'

export type SelectListTheme = ListTheme

export const selectListTheme: SelectListTheme = {
  variants: {
    menu: {
      paddingBottom: 10
    }
  },
  Item: {
    border: 0,
    margin: '0px 4px',
    padding: '5px 0px',
    variants: {
      menu: {
        borderRadius: 6
      }
    }
  }
}

export default selectListTheme
