// Copyright (c) 2025 NTT InfraNet
import React from 'react'
import PluginsContext from './Context'
import {
  getCoreServices,
  getLoadedPluginsArray,
  getLoadedServices
} from './selectors'

export const Plugins = React.memo(({ plugins, services, core }) => {
  return plugins.map(({ name, Component, requires = [] }) => {
    const provided = requires.reduce((acc, dep) => {
      acc[dep] = services[dep]
      return acc
    }, {})

    return <Component key={name} {...core} {...provided} />
  })
})

export default props => (
  <PluginsContext.Consumer>
    {state => (
      <Plugins
        core={getCoreServices(state)}
        services={getLoadedServices(state)}
        plugins={getLoadedPluginsArray(state)}
      />
    )}
  </PluginsContext.Consumer>
)
