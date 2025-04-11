// Copyright (c) 2025 NTT InfraNet
import { action } from '@storybook/addon-actions'

import store from '../../../../store'

const state = store.getState()
const assetState = {
  asset: {
    assetList: {
      isAssetRegistable: true,
      items: [
        {
          id: 'asset01',
          ionAssetId: 1,
          name: '点群ファイル01.las',
          status: 'COMPLETE',
          type: 'pointcloud',
          isDisplay: true,
          displayOrder: 1,
          isMeasurement: true
        },
        {
          id: 'asset02',
          ionAssetId: 2,
          name: '点群ファイル02.laz',
          status: 'COMPLETE',
          type: 'pointcloud',
          isDisplay: false,
          displayOrder: 2,
          isMeasurement: true
        }
      ]
    }
  }
}
const routerState = {
  router: {
    location: {
      pathname:
        '/site/db1de9ed-8368-45e5-ac9f-1506b44c318e/annotation/annotation005'
    }
  }
}
const siteState = {
  site: {
    selected: {
      data: {
        measurementUnit: {
          distance: 'm',
          area: 'm2',
          volume: 'm3'
        }
      }
    }
  }
}

export const mockStore = {
  getState: () => {
    return {
      ...state,
      ...assetState,
      ...routerState,
      ...siteState
    }
  },
  subscribe: () => 0,
  dispatch: action('dispatch')
}
