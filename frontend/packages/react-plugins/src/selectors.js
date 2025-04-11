// Copyright (c) 2025 NTT InfraNet
import { createSelector } from 'reselect'

export const getPlugins = state => state.plugins
export const getCoreServices = state => state.services

export const getPluginsArray = createSelector(getPlugins, plugins =>
  Object.values(plugins)
)

export const getLoadedPluginsArray = createSelector(
  getPluginsArray,
  pluginsArray => pluginsArray.filter(plugin => plugin.loaded)
)

export const getLoadedServices = createSelector(getPluginsArray, pluginsArray =>
  pluginsArray.reduce((services, plugin) => {
    services[plugin.name] = plugin.exports || {}
    return services
  }, {})
)
