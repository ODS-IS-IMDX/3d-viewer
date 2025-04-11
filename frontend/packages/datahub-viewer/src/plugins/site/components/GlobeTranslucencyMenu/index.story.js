import React from 'react'
import { withNamespaces } from 'react-i18next'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import GlobeTranslucencyMenuComponent from './GlobeTranslucencyMenu'
const GlobeTranslucencyMenu = withNamespaces('site')(
  GlobeTranslucencyMenuComponent
)

storiesOf('Site/GlobeTranslucencyMenu', module).add('Default', state => (
  <GlobeTranslucencyMenu
    isFadeByDistance={state.isFadeByDistance}
    onChangeFadeByDistance={action('onChangeFadeByDistance')}
    alphaValue={0.5}
    setAlphaData={action('setAlphaData')}
    onClickOutside={action('onClickOutside')}
    isHiddenBelowTerrain={false}
    onChangeIsHiddenBelowTerrain={action('onChangeIsHiddenBelowTerrain')}
  />
))
