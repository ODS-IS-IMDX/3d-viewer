import React from 'react'
import { Provider } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { Box, Flex } from '@ehv/datahub-components'

import { mockSiteStore } from 'plugins/site/components/__storybook__/mockData'
import { SiteViewer as Component } from './SiteViewer'

const SiteViewer = withNamespaces('site')(Component)

const site = {
  id: 'site-01',
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
  name: '東京'
}
// 以下プロパティは、値自体は描画に影響を及ぼさないが
const isTimelineDrawerOpen = false
const shadowOptions = {
  isShadow: false,
  isEntityShadow: true,
  isTerrainShadow: true
}
const contourOptions = {
  enable: false,
  spacing: 100,
  color: '#FFEE53'
}
const keySettings = {
  zoomIn: '',
  zoomOut: '',
  moveUp: '',
  moveDown: '',
  moveFoward: '',
  moveBackward: '',
  moveLeft: '',
  moveRight: '',
  rotateUp: '',
  rotateDown: '',
  rotateLeft: '',
  rotateRight: '',
  twistLeft: '',
  twistRight: ''
}

/* SiteViewerのstorybookコンポーネントはここだけではなく、
 * ほかのコンポーネントのstorybook(asset配下の**Layersとか、components配下のGeoJSONとか)
 * も大量に使っているため、関数getSiteViewerを作成しエクスポートする */
export const getSiteViewerStory = () => (
  <SiteViewer
    site={site}
    isTimelineDrawerOpen={isTimelineDrawerOpen}
    shadowOptions={shadowOptions}
    contourOptions={contourOptions}
    mapControlKeySettings={keySettings}
    notifyInit={() => null}
    closeTimelineDrawer={action('closeTimelineDrawer')}
    setViewer={action('setViewer')}
    unsetViewer={action('unsetViewer')}
    isRegisterOpen={action('isRegisterOpen')}
    flyToCurrentLocation={action('flyToCurrentLocation')}
    setShadowOptions={action('setShadowOptions')}
    setContourOptions={action('setContourOptions')}
  />
)

storiesOf('Site/SiteViewer', module)
  .addDecorator(story => <Provider store={mockSiteStore}>{story()}</Provider>)
  .add('Default', () => (
    <Flex height='100vh'>
      <Box flex={1} style={{ position: 'relative', height: '100%' }}>
        {getSiteViewerStory()}
      </Box>
    </Flex>
  ))
