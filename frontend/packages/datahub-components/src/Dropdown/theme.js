// Copyright (c) 2025 NTT InfraNet
// @flow
import { type Theme } from '@ehv/design-system'

export type DropdownTheme = {
  ...Theme,
  Label: Theme,
  Control: {
    ...Theme,
    Dropdown: Theme
  },
  Icon: Theme,
  Menu: {
    ...Theme,
    List: {
      ...Theme,
      Item: Theme
    }
  }
}

export const dropdownTheme: DropdownTheme = {
  backgroundColor: '#f8f8f8',
  borderRadius: 2,
  height: 40,
  width: '100%',
  borderBottom: '1px solid #3a4248',

  Label: {
    color: '#8e96a0',
    fontSize: 12,
    fontWeight: 400,
    lineHeight: '1.25'
  },

  Control: {
    height: 40,
    border: '1px solid #c4c4c4',
    borderRadius: 5,
    backgroundColor: '#f8f8f8',

    states: {
      isFocused: {
        borderBottom: '1px solid #16abe3'
      }
    },

    Dropdown: {
      width: 40,
      height: 40,
      padding: 12
    }
  },

  Icon: {
    backgroundColor: '#f8f8f8'
  },

  Menu: {
    borderRadius: 4,
    boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.16)',
    backgroundColor: '#ffffff',

    List: {
      padding: 0,

      Item: {
        height: 40,
        padding: '0 16px',
        states: {
          hover: {
            backgroundColor: '#f6f6f6'
          }
        },

        variants: {
          default: {}
        }
      }
    }
  }
}

export default dropdownTheme
