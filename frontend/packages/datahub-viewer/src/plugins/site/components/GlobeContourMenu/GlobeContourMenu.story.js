import React from 'react'
import { withNamespaces } from 'react-i18next'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import GlobeContourMenuComponent from './GlobeContourMenu'

const GlobeContourMenu = withNamespaces('site')(GlobeContourMenuComponent)

storiesOf('Site/GlobeContourMenu', module).add('Default', state => (
  <GlobeContourMenu
    isEnableContour={false}
    onChangeEnableContour={action('onChangeEnableContour')}
    spacing={100}
    onChangeSpacing={action('onChangeSpacing')}
    color={'#FFEE53'}
    onChangeColor={action('onChangeColor')}
  />
))
