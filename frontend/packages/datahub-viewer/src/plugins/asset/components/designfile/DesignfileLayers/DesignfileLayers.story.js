import React from 'react'
import { Provider } from 'react-redux'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import DesignfileLayers from './DesignfileLayers'
import { Box, Flex } from '@ehv/datahub-components'
import { SiteCesiumFill } from 'plugins/site'
import store from 'store'
import { getSiteViewerStory } from 'plugins/site/components/SiteViewer/SiteViewer.story'

const state = store.getState()
const site = {
  id: 'site01',
  name: '千葉県千葉市美浜区',
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
  }
}

export const mockStore = {
  getState: () => {
    return {
      ...state,
      site: {
        selected: {
          data: {
            ...site
          }
        }
      }
    }
  },
  subscribe: () => 0,
  dispatch: action('dispatch')
}

const designfileList = [
  {
    id: 'asset05',
    ionAssetId: 182709,
    name: '設計ファイル05.kml',
    status: 'COMPLETE',
    category: 'designFile',
    isDisplay: true,
    displayOrder: 5,
    ionAssetType: 'KML'
  },
  {
    id: 'asset06',
    ionAssetId: 338543,
    name: '設計ファイル06.dxf',
    status: 'COMPLETE',
    category: 'designFile',
    isDisplay: true,
    displayOrder: 6,
    ionAssetType: '3DTILES'
  },
  {
    id: 'asset07',
    ionAssetId: 338531,
    name: '設計ファイル07.xml',
    status: 'COMPLETE',
    category: 'designFile',
    isDisplay: true,
    displayOrder: 7,
    ionAssetType: '3DTILES'
  }
]

const designfileListError = [
  {
    id: 'asset05',
    ionAssetId: 182709,
    name: '設計ファイル05.kml',
    status: 'COMPLETE',
    category: 'designFile',
    isDisplay: false,
    isAvailable: false,
    displayOrder: 5,
    ionAssetType: 'KML'
  },
  {
    id: 'asset06',
    ionAssetId: 338543,
    name: '設計ファイル06.dxf',
    status: 'COMPLETE',
    category: 'designFile',
    isDisplay: false,
    isAvailable: false,
    displayOrder: 6,
    ionAssetType: '3DTILES'
  },
  {
    id: 'asset07',
    ionAssetId: 338531,
    name: '設計ファイル07.xml',
    status: 'COMPLETE',
    category: 'designFile',
    isDisplay: false,
    isAvailable: false,
    displayOrder: 7,
    ionAssetType: '3DTILES'
  }
]

// 以下プロパティは、値自体は描画に影響を及ぼさないが
// 格納しないと落ちてしまったり、描画を行わなくなってしまうため適当な値を格納し用意
const viewer = 'dummy'

// TODO:Cesiumで表示をする際にエラーが発生するため設計ファイルが表示されない
storiesOf('Asset/Designfile/DesignfileLayers', module)
  .addParameters({ component: DesignfileLayers })
  .addDecorator(story => (
    <Provider store={mockStore}>
      <Flex height='100vh'>
        <Box flex={1} style={{ position: 'relative', height: '100%' }}>
          {getSiteViewerStory()}
          {story()}
        </Box>
      </Flex>
    </Provider>
  ))
  .add('Default', () => (
    <SiteCesiumFill>
      <DesignfileLayers viewer={viewer} designfileList={designfileList} />
    </SiteCesiumFill>
  ))
  .add('Error', () => (
    <SiteCesiumFill>
      <DesignfileLayers viewer={viewer} designfileList={designfileListError} />
    </SiteCesiumFill>
  ))
