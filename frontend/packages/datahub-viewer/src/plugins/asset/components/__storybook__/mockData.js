// Copyright (c) 2025 NTT InfraNet
import { action } from '@storybook/addon-actions'

import store from 'store'

const state = store.getState()
const assetState = {
  asset: {
    downloadButton: {
      status: {
        buttonStatus: true
      }
    },
    fileUpload: {
      isUploading: false,
      progress: 0,
      error: {},
      axiosCancelSource: null
    },
    assetList: {
      isRenderingStatus: true,
      isAssetRegistable: true,
      items: [
        {
          id: 'asset01',
          ionAssetId: 1,
          name: '点群ファイル01.las',
          status: 'COMPLETE',
          category: 'topography',
          isDisplay: true,
          displayOrder: 1
        },
        {
          id: 'asset02',
          ionAssetId: 2,
          name: '点群ファイル02.laz',
          status: 'COMPLETE',
          category: 'topography',
          isDisplay: false,
          displayOrder: 2
        },
        {
          id: 'asset03',
          ionAssetId: 3,
          name: '画像03.tif',
          status: 'COMPLETE',
          category: 'imagery',
          isDisplay: true,
          displayOrder: 3
        },
        {
          id: 'asset04',
          ionAssetId: 4,
          name: '画像04.tif',
          status: 'COMPLETE',
          category: 'imagery',
          isDisplay: false,
          displayOrder: 4
        },
        {
          id: 'asset05',
          ionAssetId: 5,
          name: '設計ファイル05.kml',
          status: 'COMPLETE',
          category: 'designFile',
          isDisplay: true,
          displayOrder: 5
        },
        {
          id: 'asset06',
          ionAssetId: 6,
          name: 'シェープファイル05.kml',
          status: 'COMPLETE',
          category: 'overlay',
          isDisplay: true,
          displayOrder: 6
        },
        {
          id: 'asset07',
          ionAssetId: 7,
          name: 'シェープファイル07.kml',
          status: 'COMPLETE',
          category: 'overlay',
          isDisplay: true,
          displayOrder: 7
        },
        {
          id: 'asset08',
          ionAssetId: 8,
          name: 'LandXMLファイル08.xml',
          status: 'COMPLETE',
          category: 'topography',
          isDisplay: true,
          displayOrder: 8
        },
        {
          id: 'asset09',
          ionAssetId: 9,
          name: 'LandXMLファイル09.xml',
          status: 'COMPLETE',
          category: 'designFile',
          isDisplay: true,
          displayOrder: 9
        },
        {
          id: 'asset10',
          ionAssetId: 10,
          name: 'DXFファイル10.dxf',
          status: 'COMPLETE',
          category: 'designFile',
          isDisplay: true,
          displayOrder: 10
        },
        {
          id: 'asset11',
          ionAssetId: 11,
          name: '3Dファイル10.zip',
          status: 'COMPLETE',
          category: 'model3d',
          isDisplay: true,
          displayOrder: 11
        }
      ]
    },
    tilingProgress: {
      assets: [
        {
          id: 'asset00',
          name: `非常に長いファイル名abcabcabcabcabcabcabcabcabc
                abcabcabcabcabcabcabcabcabcabcabcabcabcabcabca
                bcabcabcabcabcabcabcabcabcabcabcabcabcabcabcab
                cabcabcabcabcabcabcabcabcabcabcabcabcabcabcabc
                abcabcabcabcabcabcabcabcabcabcabcabc`,
          displayOrder: 1,
          progress: 25,
          status: 'CONVERTING',
          isValidProgress: true
        },
        {
          id: 'asset01',
          name: '点群ファイル01.las',
          displayOrder: 1,
          progress: 25,
          status: 'CONVERTING',
          isValidProgress: true
        },
        {
          id: 'asset02',
          name: '点群ファイル02.las',
          displayOrder: 1,
          progress: 50,
          status: 'CONVERTING',
          isValidProgress: false
        },
        {
          id: 'asset03',
          name: '点群ファイル03.las',
          displayOrder: 1,
          progress: 50,
          status: 'UPLOADING_S3_DL',
          isValidProgress: false
        },
        {
          id: 'asset04',
          name:
            '点群ファイル04.las =====(以下のファイルはスクロールバーを表示させる用)=====',
          displayOrder: 1,
          progress: 50,
          status: 'CONVERTING',
          isValidProgress: true
        },
        {
          id: 'asset05',
          name: '点群ファイル05.las',
          displayOrder: 1,
          progress: 50,
          status: 'CONVERTING',
          isValidProgress: true
        },
        {
          id: 'asset06',
          name: '点群ファイル06.las',
          displayOrder: 1,
          progress: 50,
          status: 'CONVERTING',
          isValidProgress: true
        },
        {
          id: 'asset07',
          name: '点群ファイル07.las',
          displayOrder: 1,
          progress: 50,
          status: 'CONVERTING',
          isValidProgress: true
        },
        {
          id: 'asset08',
          name: '点群ファイル08.las',
          displayOrder: 1,
          progress: 50,
          status: 'CONVERTING',
          isValidProgress: true
        },
        {
          id: 'asset09',
          name: '点群ファイル09.las',
          displayOrder: 1,
          progress: 50,
          status: 'CONVERTING',
          isValidProgress: true
        },
        {
          id: 'asset10',
          name: '点群ファイル10.las',
          displayOrder: 1,
          progress: 50,
          status: 'CONVERTING',
          isValidProgress: true
        },
        {
          id: 'asset11',
          name: '点群ファイル11.las',
          displayOrder: 1,
          progress: 50,
          status: 'CONVERTING',
          isValidProgress: true
        },
        {
          id: 'asset12',
          name: '点群ファイル12.las',
          displayOrder: 1,
          progress: 50,
          status: 'CONVERTING',
          isValidProgress: true
        },
        {
          id: 'asset13',
          name: '点群ファイル13.las',
          displayOrder: 1,
          progress: 50,
          status: 'CONVERTING',
          isValidProgress: true
        },
        {
          id: 'asset14',
          name: '点群ファイル14.las',
          displayOrder: 1,
          progress: 50,
          status: 'CONVERTING',
          isValidProgress: true
        },
        {
          id: 'asset15',
          name: '点群ファイル15.las',
          displayOrder: 1,
          progress: 50,
          status: 'CONVERTING',
          isValidProgress: true
        },
        {
          id: 'asset16',
          name: '点群ファイル16.las',
          displayOrder: 1,
          progress: 50,
          status: 'CONVERTING',
          isValidProgress: true
        },
        {
          id: 'asset17',
          name: '点群ファイル17.las',
          displayOrder: 1,
          progress: 50,
          status: 'CONVERTING',
          isValidProgress: true
        },
        {
          id: 'asset18',
          name: '点群ファイル18.las',
          displayOrder: 1,
          progress: 50,
          status: 'CONVERTING',
          isValidProgress: true
        },
        {
          id: 'asset19',
          name: '点群ファイル19.las',
          displayOrder: 1,
          progress: 50,
          status: 'CONVERTING',
          isValidProgress: true
        },
        {
          id: 'asset20',
          name: '点群ファイル20.las',
          displayOrder: 1,
          progress: 50,
          status: 'CONVERTING',
          isValidProgress: true
        },
        {
          id: 'asset21',
          name: '点群ファイル21.las',
          displayOrder: 1,
          progress: 50,
          status: 'CONVERTING',
          isValidProgress: true
        },
        {
          id: 'asset22',
          name: '3Dファイル22.zip',
          displayOrder: 1,
          progress: 50,
          status: 'CONVERTING',
          isValidProgress: true
        }
      ]
    },
    edit: {
      target: {
        name: 'Asset001.las',
        subFileType: 1
      },
      modelMatrix: {},
      rootTransform: {},
      editingData: {
        displayName: 'Asset001.las',
        coordinates: [[135.12837453, 34.73920495, 12.34928302]],
        startDateTime: '2023-02-02T00:00:00.000Z',
        endDateTime: '2023-02-03T00:00:00.000Z'
      }
    },
    meta: {
      isDrawerOpen: true,
      isDrawerButtonEnabled: true
    }
  }
}

const siteState = {
  site: {
    selected: {
      data: {
        id: 'site01',
        bucketId: 'bucket01'
      }
    }
  }
}
const authState = {
  auth: {
    userProfile: {
      language: 'ja'
    }
  }
}

export const mockStore = {
  getState: () => {
    return {
      ...state,
      ...assetState,
      ...siteState,
      ...authState
    }
  },
  subscribe: () => 0,
  dispatch: action('dispatch')
}
