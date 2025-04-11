// Copyright (c) 2025 NTT InfraNet
// @flow
import { type Theme } from '@ehv/design-system'

export type TabsTheme = {
  ...Theme,
  List: { ...Theme },
  Tab: { ...Theme },
  TabPanel: { ...Theme }
}

export const tabsTheme: TabsTheme = {
  fontSize: '12px',

  List: {
    listStyleType: 'none'
  },

  Tab: {
    backgroundColor: '#dce3e8',
    borderRadius: '2px',
    color: '#3a4248',
    cursor: 'pointer',
    fontSize: '14px',
    fontStretch: 'normal',
    fontStyle: 'normal',
    fontWeight: 'normal',
    letterSpacing: 'normal',

    states: {
      focus: {
        outline: 'none'
      }
    }
  },

  TabPanel: {
    backgroundColor: 'white'
  }
}

export default tabsTheme
