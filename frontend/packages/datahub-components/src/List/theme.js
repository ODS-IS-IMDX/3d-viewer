// Copyright (c) 2025 NTT InfraNet
// @flow
import { type Theme } from '@ehv/design-system'

export type ListTheme = {
  ...Theme,
  Item: {
    ...Theme
  }
}

export const listTheme: ListTheme = {
  states: {
    active: {
      backgroundColor: '#f8f8f8'
    }
  },
  Item: {
    cursor: 'pointer',
    states: {
      hover: {
        backgroundColor: '#f6f6f6'
      }
    },
    variants: {
      default: {},
      menu: {
        minHeight: 40,
        borderLeft: '4px solid transparent',
        padding: '5px 4px 5px 40px',
        states: {
          hover: {
            backgroundColor: '#f6f6f6'
          },
          selected: {
            backgroundColor: '#e7f7fc',
            borderLeft: '4px solid #16abe3'
          }
        }
      },
      drawer: {
        height: 40,
        backgroundColor: '#ffffff',
        borderLeft: '4px solid transparent',
        states: {
          even: {
            backgroundColor: '#fafbfc'
          },
          hover: {
            backgroundColor: '#f6f6f6'
          },
          selected: {
            backgroundColor: '#e7f7fc',
            borderLeft: '4px solid #16abe3'
          }
        }
      },
      modal: {
        height: 56,
        borderRadius: 6,
        marginBottom: 12,
        states: {
          hover: {
            backgroundColor: '#f6f6f6'
          },
          selected: {
            border: '1px solid rgba(22,171,227,0.27)',
            backgroundColor: '#e7f7fc'
          }
        }
      },
      list: {
        borderRadius: 5,
        states: {
          hover: {
            backgroundColor: '#f6f6f6'
          },
          selected: {
            border: '1px solid #16abe3',
            backgroundColor: '#e7f7fc'
          }
        }
      }
    }
  }
}

export default listTheme
