// Copyright (c) 2025 NTT InfraNet
import { combineReducers, createStore } from 'redux'

export class ReducerRegistry {
  _reducers = {}
  _changeListener = null

  constructor ({ reducers }) {
    this._reducers = { ...reducers }
  }

  register (reducers) {
    this._reducers = { ...this._reducers, ...reducers }
    if (this._changeListener) {
      this._changeListener(this.getReducers())
    }
  }

  unregister (reducers) {}

  getReducers () {
    return { ...this._reducers }
  }

  setChangeListener (listener) {
    this._changeListener = listener
  }
}

export class PluginManager {
  _services = {}

  constructor ({ plugins, actions, reducers = {}, preloadedState, enhancer }) {
    this.reducerRegistry = new ReducerRegistry({ reducers })
    this.reducerRegistry.setChangeListener(() => {
      const reducer = combineReducers(this.reducerRegistry.getReducers())
      this.store.replaceReducer(reducer)
    })

    const reducer = combineReducers(this.reducerRegistry.getReducers())
    this.store = createStore(reducer, preloadedState, enhancer)

    Object.values(plugins).forEach(plugin => {
      this.load(plugin)
    })
  }

  load (plugin) {
    this.reducerRegistry.register(plugin.reducers)

    const consumes = {}
    // plugin.consumes.reduce((acc, name) => {
    //   acc[name] = this._services[name]
    //   return acc
    // }, {})

    consumes.dispatch = this.store.dispatch

    const provides = plugin.init(consumes)

    if (provides) {
      for (const [name, service] of Object.entries(provides)) {
        this._services[name] = service
      }
    }
  }

  unload (plugin) {
    this.reducerRegistry.unregister(plugin.reducers)
    plugin.unload()
  }

  getStore () {
    return this.store
  }
}
