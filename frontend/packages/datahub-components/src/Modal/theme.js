// Copyright (c) 2025 NTT InfraNet
// @flow
import { type Theme } from '@ehv/design-system'

export type ModalTheme = {
  ...Theme,
  Header: {
    ...Theme
  },
  Content: {
    ...Theme
  },
  Footer: {
    ...Theme
  }
}

export const modalTheme: ModalTheme = {
  variants: {
    default: {},
    transparent: {
      backgroundColor: 'transparent'
    },
    small: {
      minWidth: 244
    },
    fixed640: {
      maxWidth: 640
    }
  },
  Header: {
    padding: 20,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,

    variants: {
      default: {
        backgroundColor: '#ecf0f3'
      },
      transparent: {
        padding: 0,
        backgroundColor: 'transparent',
        textAlign: 'center'
      }
    }
  },
  Content: {
    padding: 20,

    variants: {
      default: {},
      noPadding: {
        padding: 0
      },
      transparent: {
        padding: 0,
        textAlign: 'center'
      }
    }
  },
  Footer: {
    padding: 20,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,

    variants: {
      default: {
        backgroundColor: '#ecf0f3'
      },
      transparent: {
        padding: 0,
        backgroundColor: 'transparent',
        textAlign: 'center'
      }
    }
  }
}

export default modalTheme
