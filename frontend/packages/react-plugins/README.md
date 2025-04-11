# react-plugins

React Plugins is a runtime plugin system for React apps.

<!-- MarkdownTOC autolink="true" -->

- [Quick Start](#quick-start)
  - [Instalation](#instalation)
  - [Provider](#provider)
  - [Authoring a plugin](#authoring-a-plugin)
- [Anatomy of a plugin](#anatomy-of-a-plugin)
  - [Basic plugin](#basic-plugin)
  - [Plugin `exports`](#plugin-exports)
  - [Plugin `requires`](#plugin-requires)

<!-- /MarkdownTOC -->

## Quick Start

### Instalation

React Plugins requires **React 16.4 or later**

To use React Plugins with your app:
```
npm install --save @ehv/react-plugins
```

### Provider

React Plugins provides `<Provider />`, which makes the plugins available to the rest of your app.

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from '@ehv/react-plugins

import App from './App'
import FirstPlugin from './plugins/FirstPlugin'

const plugins = [
  FirstPlugin
]

ReactDOM.render(
  <Provider plugins={plugins}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

### Authoring a plugin

A plugin is a plain React component with a static property `plugin` exposed.

```jsx
import React from 'react'

class FirstPlugin extends React.PureComponent {
  render () {
    const { Plugin } = this.props.core
    return (
      <Plugin />
    )
  }
}

FirstPlugin.plugin = {
  name: 'firstPlugin'
}

export default FirstPlugin
```

## Anatomy of a plugin

### Basic plugin

A plugin is a plain React component with a static object property `plugin` exposed. The root component of the Plugin must be a `<Plugin />` component provided via a `core` object in the plugin props.

```jsx
import React from 'react'

class SamplePlugin extends React.PureComponent {
  render () {
    const { Plugin } = this.props.core
    return (
      <Plugin />
    )
  }
}

SamplePlugin.plugin = {
  name: 'sample' // required
}

export default SamplePlugin
```

### Plugin `exports`

A plugin can expose APIs to other plugins via the `exports` prop. These exports will be accesible to other plugins in the same fashion as the `core` api that is passed via props.

```jsx
import React from 'react'

class SamplePlugin extends React.PureComponent {
  render () {
    const { Plugin } = this.props.core
    return (
      <Plugin>
        <h1>I let other plugins inject components on my tree!</h1>
        <Slot name='mySlot' />
      </Plugin>
    )
  }
}

const SampleFill = props => (
  <Fill slot='mySlot' {...props} />
)

SamplePlugin.plugin = {
  name: 'sample',
  exports: {
    SampleFill
  }
}

export default SamplePlugin
```

### Plugin `requires`

A plugin might require APIs from other plugins. These APIs will be provided via props to the plugin, under the name of the required dependency. To set the plugin dependecies, a `requires` array must be set on `plugin` static prop with the names of the required dependecies.

```jsx
import React from 'react'

class DependantPlugin extends React.PureComponent {
  render () {
    const { Plugin } = this.props.core
    const { SampleFill } = this.props.sample
    return (
      <Plugin>
        <SampleFill>
          {() => (
            <h2>I will be injected in the sample plugin slot</h2>
          )}
        </SampleFill>
      </Plugin>
    )
  }
}

DependantPlugin.plugin = {
  name: 'dependant',
  requires: ['sample']
}

export default DependantPlugin
```

