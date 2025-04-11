// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { configure, addDecorator, addParameters } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import { withI18n } from 'storybook-addon-i18n'
import { ThemeProvider } from 'styled-components'

import { Provider as PluginsProvider } from '@ehv/react-plugins'
import { theme } from '@ehv/datahub-components'
import i18n from '../src/i18n'
import authi18n from '../src/addons/auth/i18n'
import asseti18n from '../src/plugins/asset/i18n'
import datai18n from '../src/plugins/data/i18n'
import { i18n as filei18n } from '../src/plugins/file/i18n'
import sitei18n from '../src/plugins/site/i18n'
import plugins from '../src/plugins'

import { Ion } from 'cesium'
// 環境変数からcesiumアクセストークンを削除
Ion.defaultAccessToken = ''

function I18nProviderWrapper ({ children, i18n, locale }) {
  React.useEffect(() => {
    i18n.changeLanguage(locale)
  }, [i18n, locale])
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

addDecorator(withKnobs)
addDecorator(storyFn => (
  <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>
))
addDecorator(storyFn => (
  <I18nProviderWrapper i18n={i18n}>{storyFn()}</I18nProviderWrapper>
))
addDecorator(storyFn => (
  <PluginsProvider addons={[]} plugins={plugins} loaded={[]}>
    {' '}
    {storyFn()}{' '}
  </PluginsProvider>
))
addDecorator(storyFn => {
  i18n.addResourceBundle('en', 'auth', authi18n.en)
  i18n.addResourceBundle('ja', 'auth', authi18n.ja)
  i18n.addResourceBundle('en', 'data', datai18n.en)
  i18n.addResourceBundle('ja', 'data', datai18n.ja)
  i18n.addResourceBundle('en', 'file', filei18n.en)
  i18n.addResourceBundle('ja', 'file', filei18n.ja)
  i18n.addResourceBundle('en', 'asset', asseti18n.en)
  i18n.addResourceBundle('ja', 'asset', asseti18n.ja)
  i18n.addResourceBundle('en', 'site', sitei18n.en)
  i18n.addResourceBundle('ja', 'site', sitei18n.ja)
  return <>{storyFn()}</>
})
addDecorator(withI18n)

addParameters({
  options: {
    showRoots: true
  },
  i18n: {
    provider: I18nProviderWrapper,
    providerProps: {
      i18n
    },
    supportedLocales: ['ja', 'en']
  }
})

// automatically import all files ending in *.story.js
const req = require.context('../src', true, /.story.js$/)
function loadStories () {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
