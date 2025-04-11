// Copyright (c) 2025 NTT InfraNet
import { action } from '@storybook/addon-actions'

import store from 'store'

const state = store.getState()
const fileState = {
  file: {
    upload: {
      files: [
        {
          tempId: '20220101000000000_0',
          file: {},
          name: 'pointcloud6.las',
          type: '',
          size: 3193184,
          fullPath: '/pointcloud6.las',
          fileSystemName:
            'http_localhost_3000:Isolated_16CCD9E76F808DEAA03F925799319F6A',
          isAllowed: true,
          status: 'BEFORE_TILE_UPLOAD_WAITING'
        },
        {
          tempId: '20220101000000000_1',
          file: {},
          info: {
            cesiumOptions: {
              srid: null,
              verticalSrid: null,
              flipXY: null,
              invertXY: null,
              flipTexture: null,
              tilesetJsonPath: null
            },
            category: 'topography',
            formatType: 'laser',
            startDateTime: new Date('2021-09-30T15:00:00.000Z'),
            endDateTime: new Date('2021-10-30T15:00:00.000Z')
          },
          name: 'pointcloud7.las',
          type: '',
          size: 3193184,
          fullPath: '/pointcloud7.las',
          fileSystemName:
            'http_localhost_3000:Isolated_16CCD9E76F808DEAA03F925799319F6A',
          isAllowed: true
        },
        {
          tempId: '20220101000000000_2',
          file: {},
          name: 'pointcloud8.las',
          type: '',
          size: 3193184,
          fullPath: '/pointcloud8.las',
          fileSystemName:
            'http_localhost_3000:Isolated_16CCD9E76F808DEAA03F925799319F6A',
          isAllowed: true,
          status: 'BEFORE_TILE_UPLOADING',
          progress: 50
        },
        {
          file: {},
          name: '設計ファイル.xml',
          type: 'text/xml',
          size: 36910,
          fullPath: '/設計ファイル.xml',
          fileSystemName:
            'http_localhost_3000:Isolated_16CCD9E76F808DEAA03F925799319F6A',
          isAllowed: true,
          status: 'BEFORE_TILE_UPLOAD_DONE'
        },
        {
          tempId: '20220101000000000_3',
          file: {},
          info: {
            cesiumOptions: {
              srid: null,
              verticalSrid: null,
              flipXY: null,
              invertXY: null,
              flipTexture: null,
              tilesetJsonPath: null
            },
            category: 'model3d',
            formatType: '3dtiles',
            startDateTime: new Date('2021-09-30T15:00:00.000Z'),
            endDateTime: new Date('2021-10-30T15:00:00.000Z')
          },
          name: '3dtiles-topography.zip',
          type: 'application/zip',
          size: 9599930,
          fullPath: '/3dtiles-topography.zip',
          fileSystemName:
            'http_localhost_3000:Isolated_16CCD9E76F808DEAA03F925799319F6A',
          isAllowed: true
        },
        {
          tempId: '20220101000000000_4',
          file: {},
          info: {
            category: 'blackboard-internal',
            formatType: '',
            startDateTime: null,
            endDateTime: null
          },
          name: 'blackboard1.jpg',
          type: 'image/jpeg',
          size: 548570,
          fullPath: '/blackboard1.jpg',
          fileSystemName:
            'http_localhost_3000:Isolated_16CCD9E76F808DEAA03F925799319F6A',
          isAllowed: true
        },
        {
          tempId: '20220101000000000_5',
          file: {},
          name: 'blackboard2.jpg',
          type: 'image/jpeg',
          size: 548570,
          fullPath: '/blackboard2.jpg',
          fileSystemName:
            'http_localhost_3000:Isolated_16CCD9E76F808DEAA03F925799319F6A',
          isAllowed: true,
          status: 'BEFORE_TILE_UPLOAD_WAITING'
        },
        {
          tempId: '20220101000000000_6',
          file: {},
          name: 'blackboard3.jpg',
          type: 'image/jpeg',
          size: 548570,
          fullPath: '/blackboard3.jpg',
          fileSystemName:
            'http_localhost_3000:Isolated_16CCD9E76F808DEAA03F925799319F6A',
          isAllowed: true,
          status: 'BEFORE_TILE_UPLOAD_WAITING'
        },
        {
          tempId: '20220101000000000_7',
          file: {},
          name: 'example.zip',
          type: 'application/zip',
          size: 281554,
          fullPath: '/example.zip',
          fileSystemName:
            'http_localhost_3000:Isolated_16CCD9E76F808DEAA03F925799319F6A',
          isAllowed: true,
          status: 'BEFORE_TILE_UPLOAD_WAITING'
        },
        {
          tempId: '20220101000000000_8',
          file: {},
          name: 'MIHAMA_ENZ.dxf',
          type: '',
          size: 177753,
          fullPath: '/MIHAMA_ENZ.dxf',
          fileSystemName:
            'http_localhost_3000:Isolated_16CCD9E76F808DEAA03F925799319F6A',
          isAllowed: true,
          status: 'BEFORE_TILE_UPLOAD_WAITING'
        },
        {
          tempId: '20220101000000000_9',
          file: {},
          name: 'pointcloud4.las',
          type: '',
          size: 3193184,
          fullPath: '/pointcloud4.las',
          fileSystemName:
            'http_localhost_3000:Isolated_16CCD9E76F808DEAA03F925799319F6A',
          isAllowed: true,
          status: 'BEFORE_TILE_UPLOAD_WAITING'
        },
        {
          tempId: '20220101000000000_10',
          file: {},
          name: 'pointcloud5.las',
          type: '',
          size: 3193184,
          fullPath: '/pointcloud5.las',
          fileSystemName:
            'http_localhost_3000:Isolated_16CCD9E76F808DEAA03F925799319F6A',
          isAllowed: true,
          status: 'BEFORE_TILE_UPLOAD_WAITING'
        },
        {
          tempId: '20220101000000000_11',
          file: {},
          name: '20190218141012_orthophoto.tiff',
          type: 'image/tiff',
          size: 43408057,
          fullPath: '/20190218141012_orthophoto.tiff',
          fileSystemName:
            'http_localhost_3000:Isolated_AB9143F221B5F1BA75EEEA1473C5B813',
          isAllowed: true,
          status: 'BEFORE_TILE_UPLOAD_WAITING',
          info: {
            cesiumOptions: {
              srid: null,
              verticalSrid: null,
              flipXY: null,
              invertXY: null,
              flipTexture: null,
              tilesetJsonPath: null
            },
            category: 'imagery',
            formatType: 'geotiff',
            startDateTime: new Date('2021-09-30T15:00:00.000Z'),
            endDateTime: new Date('2021-10-30T15:00:00.000Z')
          }
        },
        {
          tempId: '20220101000000000_12',
          file: {},
          info: {
            cesiumOptions: {
              srid: null,
              verticalSrid: null,
              flipXY: null,
              invertXY: null,
              flipTexture: null,
              tilesetJsonPath: null
            },
            category: 'topography',
            formatType: 'laser',
            startDateTime: new Date('2021-09-30T15:00:00.000Z'),
            endDateTime: new Date('2021-10-30T15:00:00.000Z')
          },
          name:
            '20220316_090358-20220318_124507_pointcloud8-20220310_180359-20220315_144601_pointcloud8_zRXv7fnAz.las',
          type: '',
          size: 3193184,
          fullPath:
            '/20220316_090358-20220318_124507_pointcloud8-20220310_180359-20220315_144601_pointcloud8_zRXv7fnAz.las',
          fileSystemName:
            'http_localhost_3000:Isolated_F50F742D6267B4D285021B804A0931BA',
          isAllowed: true
        },
        {
          tempId: '20220101000000000_13',
          file: {},
          name: 'tiff_with_world_file_sample.zip',
          type: 'application/zip',
          size: 281554,
          fullPath: '/tiff_with_world_file_sample.zip',
          fileSystemName:
            'http_localhost_3000:Isolated_16CCD9E76F808DEAA03F925799319F6A',
          isAllowed: true,
          info: {
            cesiumOptions: {
              srid: null,
              verticalSrid: null,
              flipXY: null,
              invertXY: null,
              flipTexture: null,
              tilesetJsonPath: null
            },
            category: 'imagery',
            formatType: 'tiff',
            startDateTime: null,
            endDateTime: null
          },
          warning: {
            isOverSizeWldFile: true
          }
        },
        {
          tempId: '20220101000000000_14',
          file: {},
          name: 'dem1.tiff',
          type: 'image/tiff',
          size: 43408057,
          fullPath: '/dem1.tiff',
          fileSystemName:
            'http_localhost_3000:Isolated_AB9143F221B5F1BA75EEEA1473C5B813',
          isAllowed: true,
          status: 'BEFORE_TILE_UPLOAD_WAITING',
          info: {
            cesiumOptions: {
              srid: null,
              verticalSrid: null,
              flipXY: null,
              invertXY: null,
              flipTexture: null,
              tilesetJsonPath: null,
              isTerrain: true,
              baseTerrainId: 1
            },
            category: 'topography',
            formatType: 'geotiff',
            startDateTime: null,
            endDateTime: null
          }
        },
        {
          tempId: '20220101000000000_15',
          file: {},
          name: 'example.ifc',
          type: '',
          size: 17607143,
          fullPath: '/example.ifc',
          fileSystemName:
            'http_localhost_3000:Isolated_16CCD9E76F808DEAA03F925799319F6A',
          isAllowed: true,
          status: 'BEFORE_TILE_UPLOAD_WAITING'
        },
        {
          tempId: '20220101000000000_16',
          file: {},
          name: 'example.dwg',
          type: '',
          size: 2506656,
          fullPath: '/example.dwg',
          fileSystemName:
            'http_localhost_3000:Isolated_16CCD9E76F808DEAA03F925799319F6A',
          isAllowed: true,
          status: 'BEFORE_TILE_UPLOAD_WAITING'
        },
        {
          tempId: '20220101000000000_17',
          file: {},
          name: 'video.mp4',
          type: 'video/mp4',
          size: 293801320,
          fullPath: '/video.mp4',
          fileSystemName:
            'http_localhost_3000:Isolated_16CCD9E76F808DEAA03F925799319F6A',
          isAllowed: true,
          info: {
            category: 'video',
            formatType: '',
            startDateTime: null,
            endDateTime: null,
            locationInfo: {
              hsl: '',
              isDecimalCoordinate: true,
              lat: { decimal: 35.67621465, degree: '', minute: '', second: '' },
              lon: { decimal: 139.65139005, degree: '', minute: '', second: '' }
            }
          }
        },
        {
          tempId: '20220101000000000_18',
          file: {},
          name: 'video.mp4',
          type: 'video/mp4',
          size: 1160344134,
          fullPath: '/video.mp4',
          fileSystemName:
            'http_localhost_3000:Isolated_16CCD9E76F808DEAA03F925799319F6A',
          isAllowed: true,
          info: {
            category: 'video',
            formatType: '',
            startDateTime: null,
            endDateTime: null,
            locationInfo: {
              hsl: '',
              isDecimalCoordinate: true,
              lat: { decimal: 35.67621465, degree: '', minute: '', second: '' },
              lon: { decimal: 139.65139005, degree: '', minute: '', second: '' }
            }
          },
          warning: {
            isOverSizeVideoFile: true
          }
        },
        {
          tempId: '20220101000000000_19',
          file: {},
          name: 'video.mp4',
          type: 'video/mp4',
          size: 293801320,
          fullPath: '/video.mp4',
          fileSystemName:
            'http_localhost_3000:Isolated_16CCD9E76F808DEAA03F925799319F6A',
          isAllowed: true
        },
        {
          tempId: '20220101000000000_20',
          file: {},
          name: 'buried_structure_3d.gltf',
          type: '',
          size: 1000,
          fullPath: '/buried_structure_3d.gltf',
          fileSystemName: 'null',
          isAllowed: true,
          closedInfo: {
            rootNodeTranslation: [30541.9375, 415.6647644042969, 119467.3515625]
          }
        },
        {
          tempId: '20220101000000000_21',
          file: {},
          name: 'buried_structure_3d_no_translation.gltf',
          type: '',
          size: 1000,
          fullPath: '/buried_structure_3d_no_translation.gltf',
          fileSystemName: 'null',
          isAllowed: true
        },
        {
          tempId: '20220101000000000_22',
          file: {},
          name: 'Reichstag.gml',
          type: '',
          size: 1000,
          fullPath: 'Reichstag.gml',
          fileSystemName: 'null',
          isAllowed: true
        }
      ]
    },
    tile: {
      files: [
        {
          id: 'bbf619GEp3CLLBaeKFi83N',
          ionAssetId: 0,
          ionAssetType: '3DTILES',
          name: 'pointcloud1.las',
          displayName: 'pointcloud1.las',
          status: 'CONVERTING',
          category: 'topography',
          isDisplay: false,
          isCancelable: false,
          displayOrder: 0,
          isMeasurement: true,
          startDateTime: '2021-09-30T15:00:00.000Z',
          endDateTime: '2021-10-30T15:00:00.000Z',
          createdBy: {
            firstName: 'テスト',
            lastName: '3DV',
            userId: 'f4bf55dd-d727-4ae7-8181-3f123d61e5e2'
          },
          createdAt: '2021-10-28T07:00:18.000Z',
          updatedAt: '2021-10-28T07:00:37.000Z',
          isValidProgress: true,
          progress: 50
        },
        {
          id: 'dBzdyvhV1AZ2oi6D8Kzx5T',
          ionAssetId: 0,
          ionAssetType: '3DTILES',
          name: 'pointcloud2.las',
          displayName: 'pointcloud2.las',
          status: 'DELETE_WAIT_ERROR',
          category: 'topography',
          isDisplay: false,
          isCancelable: true,
          displayOrder: 0,
          isMeasurement: true,
          startDateTime: '2021-09-30T15:00:00.000Z',
          endDateTime: '2021-10-30T15:00:00.000Z',
          createdBy: {
            firstName: 'テスト',
            lastName: '3DV',
            userId: 'f4bf55dd-d727-4ae7-8181-3f123d61e5e2'
          },
          createdAt: '2021-10-28T07:00:18.000Z',
          updatedAt: '2021-10-28T07:00:30.000Z',
          isValidProgress: false
        },
        {
          id: 'uWakw7gnjATDHzXhBzsoi4',
          ionAssetId: 0,
          ionAssetType: '3DTILES',
          name: 'pointcloud3.las',
          displayName: 'pointcloud3.las',
          status: 'CONVERTING',
          category: 'topography',
          isDisplay: false,
          isCancelable: true,
          displayOrder: 0,
          isMeasurement: true,
          startDateTime: '2021-09-30T15:00:00.000Z',
          endDateTime: '2021-10-30T15:00:00.000Z',
          createdBy: {
            firstName: 'テスト',
            lastName: '3DV',
            userId: 'f4bf55dd-d727-4ae7-8181-3f123d61e5e2'
          },
          createdAt: '2021-10-28T07:00:18.000Z',
          updatedAt: '2021-10-28T07:00:30.000Z',
          isValidProgress: true,
          progress: 99
        }
      ]
    }
  }
}
const siteState = {
  site: {
    selected: {
      data: {
        id: 'site01',
        name: 'site-name-001',
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

const fileStorageLisWithIcon = [
  {
    id: '1',
    bucketId: 'bucketId_001',
    nodeId: 'nodeId_001',
    name: 'node.las',
    isDirectory: false
  },
  {
    id: '2',
    bucketId: 'bucketId_001',
    nodeId: 'nodeId_002',
    name: 'node.xml',
    isDirectory: false
  },
  {
    id: '3',
    bucketId: 'bucketId_001',
    nodeId: 'nodeId_003',
    name: 'node.dxf',
    isDirectory: false
  },
  {
    id: '4',
    bucketId: 'bucketId_001',
    nodeId: 'nodeId_004',
    name: 'node.citygml',
    isDirectory: false
  },
  {
    id: '5',
    bucketId: 'bucketId_001',
    nodeId: 'nodeId_005',
    name: 'node.kml',
    isDirectory: false
  },
  {
    id: '6',
    bucketId: 'bucketId_001',
    nodeId: 'nodeId_006',
    name: 'node.zip',
    isDirectory: false
  },
  {
    id: '7',
    bucketId: 'bucketId_001',
    nodeId: 'nodeId_007',
    name: 'node.czml',
    isDirectory: false
  },
  {
    id: '8',
    bucketId: 'bucketId_001',
    nodeId: 'nodeId_008',
    name: 'node.topojson',
    isDirectory: false
  },
  {
    id: '9',
    bucketId: 'bucketId_001',
    nodeId: 'nodeId_009',
    name: 'node.jpg',
    isDirectory: false
  },
  {
    id: '10',
    bucketId: 'bucketId_001',
    nodeId: 'nodeId_010',
    name: 'node.tif',
    isDirectory: false
  },
  {
    id: '11',
    bucketId: 'bucketId_001',
    nodeId: 'nodeId_011',
    name: 'node.fbx',
    isDirectory: false
  },
  {
    id: '12',
    bucketId: 'bucketId_001',
    nodeId: 'nodeId_012',
    name: 'node.ifc',
    isDirectory: false
  },
  {
    id: '13',
    bucketId: 'bucketId_001',
    nodeId: 'nodeId_013',
    name: 'node.dwg',
    isDirectory: false
  },
  {
    id: '14',
    bucketId: 'bucketId_001',
    nodeId: 'nodeId_014',
    name: 'node.mov',
    isDirectory: false
  }
]

export const mockStore = {
  getState: () => ({
    ...state,
    ...fileState,
    ...siteState,
    ...authState
  }),
  getSelectedSite: () => siteState.site.selected,
  getItemWithIcon: () => fileStorageLisWithIcon,
  subscribe: () => 0,
  dispatch: action('dispatch')
}
