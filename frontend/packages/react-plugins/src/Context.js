// Copyright (c) 2025 NTT InfraNet
import React from 'react'
import { Provider as SlotFillProvider } from '@ehv/react-slots'

import Plugin from './Plugin'
import Plugins from './Plugins'
import Route from './Route'
import Router from './Router'

const Context = React.createContext()

export class Provider extends React.PureComponent {
  withDependencies = (names = [], plugins = new Set()) => {
    names = Array.isArray(names) ? names : [names]

    names.forEach(name => {
      const plugin = this.state.plugins[name]
      if (!plugin) {
        throw new Error(`Plugin dependency '${name}' not found`)
      }
      plugins.add(plugin.name)
      this.withDependencies(plugin.requires, plugins)
    })

    return [...plugins]
  }

  withDependants = (names = [], plugins = new Set()) => {
    names = Array.isArray(names) ? names : [names]

    names.forEach(name => {
      const dependants = Object.values(this.state.plugins).reduce(
        (dependants, { name: dependant, requires = [] }) => {
          if (requires.indexOf(name) !== -1) {
            plugins.add(dependant)
            return [dependant, ...dependants]
          }
          return dependants
        },
        []
      )
      plugins.add(name)
      this.withDependants(dependants, plugins)
    })

    return [...plugins]
  }

  register = async plugins => {
    plugins = Array.isArray(plugins) ? plugins : [plugins]

    plugins = plugins.reduce((plugins, Plugin) => {
      plugins[Plugin.plugin.name] = {
        ...Plugin.plugin,
        loaded: false,
        Component: Plugin
      }
      return plugins
    }, {})

    await new Promise(resolve => {
      this.setState(
        state => ({
          plugins: {
            ...state.plugins,
            ...plugins
          }
        }),
        resolve
      )
    })
  }

  load = names => {
    names = this.withDependencies(names).filter(
      name => !this.state.plugins[name].loaded
    )
    const plugins = names.map(name => this.state.plugins[name])
    const loaded = Object.values(this.state.plugins).filter(
      plugin => plugin.loaded
    )

    this.props.addons.map(addon => addon.load(plugins, loaded))

    const change = plugins.reduce((change, { name }) => {
      change[name] = {
        ...this.state.plugins[name],
        loaded: true
      }
      return change
    }, {})

    this.setState({
      plugins: {
        ...this.state.plugins,
        ...change
      }
    })
  }

  unload = names => {
    names = this.withDependants(names).filter(
      name => this.state.plugins[name].loaded
    )
    const plugins = names.map(name => this.state.plugins[name])
    const loaded = Object.values(this.state.plugins).filter(
      plugin => plugin.loaded
    )

    this.props.addons.map(addon => addon.unload(plugins, loaded))

    const change = plugins.reduce((change, { name }) => {
      change[name] = {
        ...this.state.plugins[name],
        loaded: false
      }
      return change
    }, {})

    this.setState({
      plugins: {
        ...this.state.plugins,
        ...change
      }
    })

    console.log(`Plugins ${names.join(', ')} unloaded.`)
  }

  async componentDidMount () {
    await this.register(this.props.plugins)
    this.load(this.props.loaded)
  }

  state = {
    load: this.load,
    unload: this.unload,
    plugins: [],
    services: {
      core: {
        Plugin
      },
      router: {
        Route,
        Router
      }
    }
  }

  render () {
    return (
      <Context.Provider value={this.state}>
        <SlotFillProvider>
          {this.props.children}
          <Plugins />
        </SlotFillProvider>
      </Context.Provider>
    )
  }
}

export const Consumer = Context.Consumer

export default {
  Provider: Provider,
  Consumer: Context.Consumer
}
