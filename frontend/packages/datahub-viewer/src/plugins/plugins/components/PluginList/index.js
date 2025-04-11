// Copyright (c) 2025 NTT InfraNet
import React from 'react'
import { Context as PluginsContext, getPluginsArray } from '@ehv/react-plugins'
import { PluginList } from './PluginList'

const components = props => (
  <PluginsContext.Consumer>
    {state => (
      <PluginList
        plugins={getPluginsArray(state)}
        load={state.load}
        unload={state.unload}
      />
    )}
  </PluginsContext.Consumer>
)

export default components
