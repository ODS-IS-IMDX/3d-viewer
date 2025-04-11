// Copyright (c) 2025 NTT InfraNet
// @flow
import { type Theme } from '@ehv/design-system'

export type AccordionTheme = {
  ...Theme,
  Item: {
    ...Theme,
    Header: {
      ...Theme
    },
    Content: {
      ...Theme
    }
  }
}

export const accordionTheme: AccordionTheme = {
  variants: {
    default: {},
    menu: {
      states: {
        expanded: {
          backgroundColor: '#f8f8f8'
        }
      }
    },
    submenu: {}
  },
  Item: {
    variants: {
      default: {},
      menu: {
        states: {
          expanded: {
            borderRadius: 5,
            backgroundColor: '#ffffff'
          }
        }
      }
    },
    Header: {
      color: '#3a4248',
      variants: {
        default: {},
        menu: {
          minHeight: 50,
          padding: '5px 4px',
          states: {
            shadow: {
              position: 'fixed',
              width: '256px',
              zIndex: 99998,
              backgroundColor: '#3a4248',
              cursor: 'initial'
            }
          }
        },
        submenu: {
          height: 40,
          padding: '5px 4px'
        }
      }
    },
    Content: {
      variants: {
        submenu: {
          padding: '0 4px'
        }
      }
    }
  }
}

export default accordionTheme
