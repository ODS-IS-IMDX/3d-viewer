import React from 'react'
import { Provider } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { mockSiteStore } from 'plugins/site/components/__storybook__/mockData'
import { SiteViewerContextMenu as SiteViewerContextMenuComponent } from './SiteViewerContextMenu'

const SiteViewerContextMenu = withNamespaces('site')(
  SiteViewerContextMenuComponent
)

storiesOf('Site/SiteViewerContextMenu', module)
  .addDecorator(story => <Provider store={mockSiteStore}>{story()}</Provider>)
  .add('Default', () => (
    <SiteViewerContextMenu
      unit='m'
      mapType='satellite'
      renderQualityName='standard'
      mapviewName='d3'
      onClose={action('onClose')}
      openMapTypeModal={action('openMapTypeModal')}
      openRenderQualityModal={action('openRenderQualityModal')}
      openMapviewModal={action('openMapviewModal')}
      openGlobeContourMenu={action('openGlobeContourMenu')}
      openLightControllerMenu={action('openLightControllerMenu')}
      openCameraControlModal={action('openCameraControlModal')}
    />
  ))
