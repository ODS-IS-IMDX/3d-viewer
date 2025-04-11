// Copyright (c) 2025 NTT InfraNet
import { action } from '@storybook/addon-actions'
import store from 'store'

const state = store.getState()
const assetState = {
  asset: {
    assetList: {
      isLoading: false,
      items: [
        {
          id: 'isLoading',
          ionAssetId: 0,
          ionAssetType: '3DTILES',
          name: 'isLoading.las',
          displayName: 'isLoading.las',
          status: 'CONVERTED',
          category: 'topography',
          isDisplay: false,
          displayOrder: 0,
          isMeasurement: true,
          startDateTime: '2021-11-03T15:00:00.000Z',
          endDateTime: '2021-11-04T15:00:00.000Z',
          createdBy: {
            firstName: 'テスト',
            lastName: '3DV',
            userId: 'f4bf55dd-d727-4ae7-8181-3f123d61e5e2'
          },
          createdAt: '2021-11-05T02:13:02.000Z',
          updatedAt: '2021-11-10T02:33:04.000Z',
          style: {
            pointSize: 5.5
          },
          isAvailable: true,
          isLoaded: true
        },
        {
          id: 'isNotVisibleInTimeline',
          ionAssetId: 0,
          ionAssetType: '3DTILES',
          name: 'isNotVisibleInTimeline.las',
          displayName: 'isNotVisibleInTimeline.las',
          status: 'CONVERTED',
          category: 'topography',
          isDisplay: false,
          displayOrder: 0,
          isMeasurement: true,
          startDateTime: '2021-11-03T15:00:00.000Z',
          endDateTime: '2021-11-04T15:00:00.000Z',
          createdBy: {
            firstName: 'テスト',
            lastName: '3DV',
            userId: 'f4bf55dd-d727-4ae7-8181-3f123d61e5e2'
          },
          createdAt: '2021-11-05T02:13:02.000Z',
          updatedAt: '2021-11-10T02:33:04.000Z',
          style: {
            pointSize: 5.5
          },
          isAvailable: true,
          isLoaded: true
        },
        {
          id: 'isVisibleInTimeline',
          ionAssetId: 0,
          ionAssetType: '3DTILES',
          name: 'isVisibleInTimeline.las',
          displayName: 'isVisibleInTimeline.las',
          status: 'CONVERTED',
          category: 'topography',
          isDisplay: true,
          displayOrder: 0,
          isMeasurement: true,
          startDateTime: '2021-11-03T15:00:00.000Z',
          endDateTime: '2021-11-04T15:00:00.000Z',
          createdBy: {
            firstName: 'テスト',
            lastName: '3DV',
            userId: 'f4bf55dd-d727-4ae7-8181-3f123d61e5e2'
          },
          createdAt: '2021-11-05T02:13:02.000Z',
          updatedAt: '2021-11-10T02:33:04.000Z',
          style: {
            pointSize: 5.5
          },
          isAvailable: true,
          isLoaded: true
        },
        {
          id: 'kFV4NY1waCK33iUtEwXACy',
          ionAssetId: 671185,
          ionAssetType: '3DTILES',
          formatType: 'citygml',
          name: '設計ファイル.xml',
          displayName: '設計ファイル.xml',
          status: 'CONVERTED',
          category: 'designFile',
          isDisplay: true,
          displayOrder: 0,
          isMeasurement: true,
          isTransparency: true,
          style: {
            color: '#fff',
            transparency: 0.6
          },
          startDateTime: '1970-01-01T00:00:00.000Z',
          endDateTime: '9999-12-30T15:00:00.000Z',
          createdBy: {
            firstName: 'テスト',
            lastName: '3DV',
            userId: 'f4bf55dd-d727-4ae7-8181-3f123d61e5e2'
          },
          createdAt: '2021-11-12T00:28:33.000Z',
          updatedAt: '2021-11-12T00:29:57.000Z',
          isAvailable: false
        },
        {
          id: '7jJcey3DPgnYx4PEGvutS3',
          ionAssetId: 669481,
          ionAssetType: '3DTILES',
          formatType: '3dtiles',
          name: '3dtiles-topography.zip',
          displayName: '3dtiles-topographyasdf.zip',
          status: 'CONVERTED',
          category: 'model3d',
          isDisplay: true,
          displayOrder: 0,
          isMeasurement: false,
          isTransparency: true,
          style: {
            transparency: 0.6
          },
          startDateTime: '1970-01-01T00:00:00.000Z',
          endDateTime: '9999-12-30T15:00:00.000Z',
          createdBy: {
            firstName: 'テスト',
            lastName: '3DV',
            userId: 'f4bf55dd-d727-4ae7-8181-3f123d61e5e2'
          },
          createdAt: '2021-11-11T00:22:18.000Z',
          updatedAt: '2021-11-11T00:48:52.000Z',
          isAvailable: false
        },
        {
          id: '3aAuHANWhxr3Jw7pLCBmuC',
          ionAssetId: 663235,
          ionAssetType: '3DTILES',
          formatType: 'laser',
          name: 'pointcloud1.las',
          displayName: 'pointcloud1.las',
          status: 'CONVERTED',
          category: 'topography',
          isDisplay: true,
          displayOrder: 0,
          isMeasurement: true,
          startDateTime: '2021-11-03T15:00:00.000Z',
          endDateTime: '2021-11-04T15:00:00.000Z',
          createdBy: {
            firstName: 'テスト',
            lastName: '3DV',
            userId: 'f4bf55dd-d727-4ae7-8181-3f123d61e5e2'
          },
          createdAt: '2021-11-05T02:13:02.000Z',
          updatedAt: '2021-11-10T02:33:04.000Z',
          style: {
            pointSize: 5.5
          },
          isAvailable: true,
          isLoaded: true
        }
      ],
      isAssetRegistable: true,
      isRenderingStatus: {
        isLoading: true
      }
    },
    downloadButton: {
      status: {}
    },
    fileUpload: {
      isUploading: false,
      progress: 0,
      error: {},
      axiosCancelSource: null
    },
    tilingProgress: {
      tilingFilesNumber: 0,
      assets: []
    },
    meta: {
      isDrawerOpen: true
    }
  }
}
const routerState = {
  router: {
    location: {
      pathname: '/site/db1de9ed-8368-45e5-ac9f-1506b44c318e'
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
        },
        viewStructure: {
          elements: [
            {
              name: 'ユーザ仕分け親フォルダ',
              title: 'ユーザ仕分け親フォルダ',
              nodeID: 1,
              children: [
                {
                  name: '子フォルダ',
                  title: '子フォルダ',
                  nodeID: 2,
                  children: [
                    {
                      name: 'JP0H0000002Z_test',
                      title: 'JP0H0000002Z_test',
                      nodeID: 3,
                      expanded: false,
                      fileType: 3,
                      isDirectory: false,
                      referenceId: 'bucie0bdik2cki52vcpg'
                    },
                    {
                      name: 'JP0H0000003Z',
                      title: 'JP0H0000003Z',
                      nodeID: 4,
                      expanded: false,
                      fileType: 3,
                      isDirectory: false,
                      referenceId: 'bucie4bdik2cki52vcq0'
                    }
                  ],
                  expanded: true,
                  isDirectory: true
                },
                {
                  name: 'pointcloud1.las',
                  title: 'pointcloud1.las',
                  nodeID: 5,
                  expanded: false,
                  fileType: 1,
                  isDirectory: false,
                  referenceId: '3aAuHANWhxr3Jw7pLCBmuC',
                  subFileType: 1
                }
              ],
              expanded: true,
              isDirectory: true
            }
          ]
        }
      }
    },
    sideBar: {
      activeIconName: 'FILE',
      openSideContextMenu: {
        close: () => {}
      }
    },
    mobile: {
      isMobile: false,
      openViewName: null
    },
    viewer: {
      ref: {
        clock: {
          currentTime: 'currentTime'
        },
        scene: {
          requestRender: () => {},
          requestRenderMode: true
        }
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
const authStatePro = {
  auth: {
    userProfile: {
      licenseType: 'PRO',
      language: 'ja'
    }
  }
}
const fileState = {
  file: {
    download: {
      downloadingFileIdList: []
    }
  }
}
const dataState = {
  data: {
    meta: {
      menuMode: 'SHOW'
    },
    delete: {
      deleteItem: {
        annotation: [{ id: 'annotation-01', name: 'annotation-01' }],
        asset: [{ id: 'asset-01', name: 'asset-01' }],
        image: [{ id: 'image-01', name: 'image-01' }],
        wmts: [{ id: 'wmts-01', name: 'wmts-01' }],
        video: [{ id: 'video-01', name: 'video-01' }],
        folder: [
          {
            index: 1,
            data: {
              id: 'folder-01',
              name: 'folder-01'
            }
          }
        ]
      }
    }
  },
  timeline: {
    inTimelineDataList: [
      {
        id: 'k3kshzhukV4kmbtSeVri9o',
        displayName: '13101_chiyoda-ku_2.zip',
        fileType: 1,
        subFileType: 3,
        startDateTime: '2022-02-28T15:00:00.000Z',
        endDateTime: '2022-03-21T15:00:00.000Z',
        isVisible: true
      },
      {
        id: 'q2y8h1Mn62RH2zLdqRMvLP',
        displayName: 'pointcloud.las',
        fileType: 1,
        subFileType: 1,
        startDateTime: '2022-02-28T15:00:00.000Z',
        endDateTime: '2022-03-30T15:00:00.000Z',
        isVisible: true
      }
    ]
  }
}

export const mockMenuItemData = {
  getState: () => ({
    ...state,
    ...authState,
    ...assetState,
    ...routerState,
    ...siteState,
    ...fileState,
    ...dataState
  }),
  getDeleteItem: () => dataState.data.delete.deleteItem,
  subscribe: () => 0,
  dispatch: action('dispatch')
}

export const mockMenuItemDataPro = {
  getState: () => ({
    ...state,
    ...authStatePro,
    ...assetState,
    ...routerState,
    ...siteState,
    ...fileState,
    ...dataState
  }),
  getDeleteItem: () => dataState.data.delete.deleteItem,
  subscribe: () => 0,
  dispatch: action('dispatch')
}
