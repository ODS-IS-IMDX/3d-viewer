// Copyright (c) 2025 NTT InfraNet
import { action } from '@storybook/addon-actions'

import store from '../../../../store'

const state = store.getState()
export const site = {
  id: 'site01',
  name: '現場1 東京都新宿区',
  location: {
    bounds: {
      bottom: 35.60241707746495,
      left: 140.08386056975306,
      right: 140.0854487512306,
      top: 35.603728249774385
    },
    lat: 35.60316768884275,
    lng: 140.0845718459677,
    zoom: 12
  },
  ccrs: {
    id: 'kEJjR66fYV5dPXgdjXWBsN',
    name: 'Geodetic (projection + geoid)',
    type: 'GEODETIC',
    version: 0,
    parameters: {
      geoid: 'gsigeo2011',
      projection: {
        proj4:
          '+proj=tmerc +lat_0=36 +lon_0=139.8333333333333 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs',
        epsgCode: 'EPSG:6677',
        params: {}
      },
      translation: {},
      rotation: {},
      verticalShift: {}
    },
    rawControlPoints: [],
    measurementSystem: {
      system: 'metric',
      position: 'm',
      length: 'm',
      mass: 'tonne',
      area: 'm2',
      volume: 'm3',
      density: 'tonne/m3'
    },
    geoidHeight: 34.838677
  },
  status: 'IS_IMPORTED',
  viewStructure: {}
}

const notifications = {
  meta: {
    isLoading: false,
    isOpen: false
  },
  users: [
    {
      id: 'contact-id-001',
      name: 'contact-name-001',
      email: 'contact-name-001@sample.com',
      status: 'ENABLED',
      createdBy: {
        userId: 'user001',
        firstName: '太郎001',
        lastName: 'テスト001'
      },
      createdAt: '2021-01-01T01:00:00.000Z',
      updatedBy: {
        userId: 'updated001',
        firstName: '更新者001',
        lastName: 'テスト001'
      },
      updatedAt: '2021-01-01T01:00:01.000Z'
    },
    {
      id: 'contact-id-002',
      name: 'contact-name-002',
      email: 'contact-name-002@sample.com',
      status: 'ENABLED',
      createdBy: {
        userId: 'user001',
        firstName: '太郎001',
        lastName: 'テスト001'
      },
      createdAt: '2021-01-01T02:00:00.000Z',
      updatedBy: {
        userId: 'updated001',
        firstName: '更新者001',
        lastName: 'テスト001'
      },
      updatedAt: '2021-01-01T02:00:02.000Z'
    },
    {
      id: 'contact-id-003',
      name: 'contact-name-003',
      email: 'contact-name-003@sample.com',
      status: 'INVALID',
      createdBy: {
        userId: 'user001',
        firstName: '太郎001',
        lastName: 'テスト001'
      },
      createdAt: '2021-01-01T03:00:00.000Z',
      updatedBy: {
        userId: 'updated001',
        firstName: '更新者001',
        lastName: 'テスト001'
      },
      updatedAt: '2021-01-01T03:00:03.000Z'
    }
  ]
}

const siteState = {
  site: {
    ...state.site,
    open: true,
    isMapSetting: false,
    selected: {
      data: site,
      id: site.id,
      isLoading: false
    },
    notifications: {
      ...notifications
    },
    sideBar: {
      activeIconName: 'FILE'
    },
    mobile: {
      isMobile: false,
      openViewName: null
    },
    viewer: {
      control: {
        settings: {
          mouse: {
            horizontal: [0],
            rotate: [2],
            zoom: [3, 4]
          },
          key: {
            moveBackward: '',
            moveDown: '',
            moveFoward: '',
            moveLeft: '',
            moveRight: '',
            moveUp: '',
            rotateDown: '',
            rotateLeft: '',
            rotateRight: '',
            rotateUp: '',
            twistLeft: '',
            twistRight: '',
            zoomIn: '',
            zoomOut: ''
          }
        }
      },
      shadow: {
        datetime: null,
        isShadow: false,
        isEntityShadow: true,
        isTerrainShadow: true
      }
    }
  }
}

const siteMobileState = {
  site: {
    ...state.site,
    open: true,
    isMapSetting: false,
    selected: {
      data: site,
      id: site.id,
      isLoading: false
    },
    sideBar: {
      activeIconName: 'FILE'
    },
    mobile: {
      isMobile: true,
      openViewName: null
    },
    viewer: {
      control: {
        settings: {
          mouse: {
            horizontal: [0],
            rotate: [2],
            zoom: [3, 4]
          },
          key: {
            moveBackward: '',
            moveDown: '',
            moveFoward: '',
            moveLeft: '',
            moveRight: '',
            moveUp: '',
            rotateDown: '',
            rotateLeft: '',
            rotateRight: '',
            rotateUp: '',
            twistLeft: '',
            twistRight: '',
            zoomIn: '',
            zoomOut: ''
          }
        }
      },
      shadow: {
        datetime: null,
        isShadow: false,
        isEntityShadow: true,
        isTerrainShadow: true
      }
    }
  }
}

const assetState = {
  asset: {
    fileUpload: {},
    assetList: {
      isAssetRegistable: true
    },
    tilingProgress: {
      tilingFilesNumber: 0
    },
    meta: {
      isDrawerButtonEnabled: true,
      isDrawerOpen: false
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

const fileState = {
  file: {
    upload: {
      files: [],
      selectedFileIndex: null,
      uploadingFilesNumber: 0,
      needUploadFilesNumber: 0
    },
    tile: {
      files: [],
      tilingFilesNumber: 0
    },
    download: {
      downloadingFileIdList: []
    }
  }
}

const authState = {
  auth: {
    userProfile: {
      language: 'ja',
      licenseType: 'NOMAL'
    }
  }
}

export const mockSiteStore = {
  getState: () => {
    return {
      ...authState,
      ...state,
      ...siteState,
      ...assetState,
      ...routerState,
      ...fileState
    }
  },
  getUserProfileNomal: () => authState.auth.userProfile,
  subscribe: () => 0,
  dispatch: action('dispatch'),
  getNotificationUsers: () => siteState.site.notifications.users
}

export const mockSiteMobileStore = {
  getState: () => {
    return {
      ...authState,
      ...state,
      ...siteMobileState,
      ...assetState,
      ...routerState,
      ...fileState
    }
  },
  subscribe: () => 0,
  dispatch: action('dispatch')
}

export const mockSiteStoreNotificationsEmpty = {
  ...mockSiteStore,
  getState: () => ({
    ...mockSiteStore.getState(),
    site: {
      ...mockSiteStore.getState().site,
      notifications: {
        ...mockSiteStore.getState().site.notifications,
        users: []
      }
    }
  })
}
