import React from 'react'
import { Provider } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import MapSettingsMenuComponent from './MapSettingsMenu'
import { mockSiteStore } from 'plugins/site/components/__storybook__/mockData'
import { ModalWindowsContext } from '../SiteViewer/SiteViewer'

const MapSettingsMenu = withNamespaces('site')(MapSettingsMenuComponent)

storiesOf('Site/MapSettingsMenu', module)
  .addDecorator(story => <Provider store={mockSiteStore}>{story()}</Provider>)
  .addDecorator(Story => (
    <ModalWindowsContext.Provider>
      <Story />
    </ModalWindowsContext.Provider>
  ))
  .add('Default', state => (
    <MapSettingsMenu
      mapView='low'
      onChangeMapView={action('onChangeMapView')}
      mapType='arcgis.satellite'
      onChangeMapType={action('onChangeMapType')}
      renderQuality='low'
      onChangeRenderQuality={action('onChangeRenderQuality')}
      isFadeByDistance={false}
      onChangeFadeByDistance={action('onChangeFadeByDistance')}
      alphaValue={0.5}
      onChangeAlphaData={action('onChangeAlphaData')}
      isEnableContour={false}
      onChangeEnableContour={action('onChangeEnableContour')}
      spacing={100}
      onChangeSpacing={action('onChangeSpacing')}
      color='#FFEE53'
      onChangeColor={action('onChangeColor')}
      isHiddenBelowTerrain={false}
      onChangeIsHiddenBelowTerrain={action('onChangeIsHiddenBelowTerrain')}
    />
  ))
  .add('Mobile Mode', state => (
    <MapSettingsMenu
      mapView='low'
      onChangeMapView={action('onChangeMapView')}
      mapType='arcgis.satellite'
      onChangeMapType={action('onChangeMapType')}
      renderQuality='low'
      onChangeRenderQuality={action('onChangeRenderQuality')}
      isFadeByDistance={false}
      onChangeFadeByDistance={action('onChangeFadeByDistance')}
      alphaValue={0.5}
      onChangeAlphaData={action('onChangeAlphaData')}
      isEnableContour={false}
      onChangeEnableContour={action('onChangeEnableContour')}
      spacing={100}
      onChangeSpacing={action('onChangeSpacing')}
      color='#FFEE53'
      onChangeColor={action('onChangeColor')}
      isHiddenBelowTerrain={false}
      onChangeIsHiddenBelowTerrain={action('onChangeIsHiddenBelowTerrain')}
      isMobile
    />
  ))
