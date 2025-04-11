import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { LanguageSelect } from './LanguageSelect'

const i18n = {
  language: 'cn',
  languages: ['cn', 'sp', 'kr', 'en', 'gm'],
  changeLanguage: param => action(`changeLanguage param:${param}`),
  on: (param1, param2) => action('on'),
  off: (param1, param2) => action('off')
}

storiesOf('LanguageSelect', module)
  .addParameters({ component: LanguageSelect })
  .add('default', () => <LanguageSelect i18n={i18n} />)
  .add('set languages', () => (
    <LanguageSelect languages={['cn', 'sp', 'kr', 'en', 'gm']} i18n={i18n} />
  ))
