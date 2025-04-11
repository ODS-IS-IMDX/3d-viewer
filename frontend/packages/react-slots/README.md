# react-slots

React Slots is a library to merge React subtrees together using Slot and Fill components. 

<!-- MarkdownTOC autolink="true" -->

- [Quick Start](#quick-start)
  - [Instalation](#instalation)
  - [`Slot`](#slot)
  - [`Fill`](#fill)
  - [Context `Provider`](#context-provider)
  - [Simple `Slot` & `Fill`](#simple-slot--fill)
- [Advanced use cases](#advanced-use-cases)
  - [Passing props from `Slot` to `Fill`](#passing-props-from-slot-to-fill)
  - [Multiple `Fill`s for the same `Slot`](#multiple-fills-for-the-same-slot)
  - [Wrapping fills in a `Slot`](#wrapping-fills-in-a-slot)
  - [Using `Slot`s and `Fill`s as declarative extension point for your app](#using-slots-and-fills-as-declarative-extension-point-for-your-app)
    - [Using `Slot` wrapped fills](#using-slot-wrapped-fills)
    - [Using `Slot` `onFills`](#using-slot-onfills)

<!-- /MarkdownTOC -->

## Quick Start

### Instalation

React Slots requires **React 16.4 or later**

To use React Slots with your app:
```
npm install --save @ehv/react-slots
```

### `Slot`

The `Slot` component is where the matching `Fill` subtrees will be injected.

**Props**

| Prop name   | Type     | Required | Description                       |
| ----------- | -------- | -------- | --------------------------------- |
| name        | string   | yes      | Name of the slot                  |
| onFills     | function | no       | Called when fills change          |
| children    | function | no       | Wrap function for matching fills  |

### `Fill`

Use `Fill` component to inject a subtree into a slot.

**Props**

| Prop name   | Type     | Required | Description                        |
| ----------- | -------- | -------- | ---------------------------------- |
| slot        | string   | yes      | Name of the slot to fill           |
| children    | function | no       | Function returning subtree to fill |

### Context `Provider`

All `Slot`s and `Fill`s require context that is provided by a `Provider` component. The `Provider` should be set at the top of the component tree so that all `Slot`s and `Fill`s can capture it's context.

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from '@ehv/react-slots

import App from './App'

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

### Simple `Slot` & `Fill`

```jsx
import React from 'react'
import { Slot, Fill } from '@ehv/react-slots'

const Foo = () => (
  <div>
    <span>Hello </span>
    <Slot name='foo' />
  </div>
)

const Bar = () => (
  <Fill slot='foo'>
    {() => (
      <span>World!</span>
    )}
  </Fill>
)

const App = () => (
  <div>
    <Foo />
    <Bar />
  </div>
)
```

The HTML output will be:

```html
<div>
  <!-- <Foo /> -->
  <div>
    <span>Hello </span>
    <span>World!</span>
  </div>
  <!-- <Bar /> -->
</div>
```

## Advanced use cases

### Passing props from `Slot` to `Fill`

Any additional props passed to a `Slot` will be passed to the corresponding `Fill`s:

```jsx
import React from 'react'
import { Slot, Fill } from '@ehv/react-slots'

const Foo = () => (
  <div>
    <span>Hello </span>
    <Slot name='foo' label='crazy' />
  </div>
)

const Bar = () => (
  <Fill slot='foo'>
    {({ label }) => (
      <span>{label} World!</span>
    )}
  </Fill>
)

const App = () => (
  <div>
    <Foo />
    <Bar />
  </div>
)
```

The HTML output will be:

```html
<div>
  <!-- <Foo /> -->
  <div>
    <span>Hello </span>
    <span>crazy World!</span>
  </div>
  <!-- <Bar /> -->
</div>
```

### Multiple `Fill`s for the same `Slot`

A `Slot` can take any amount of fills. 

```jsx
import React from 'react'
import { Slot, Fill } from '@ehv/react-slots'

const Foo = () => (
  <div>
    <span>Hello </span>
    <Slot name='foo' label='crazy' />
  </div>
)

const Bar = () => (
  <Fill slot='foo'>
    {({ label }) => (
      <span>{label} World!</span>
    )}
  </Fill>
)

const FooBar = () => (
  <Fill slot='foo'>
    {({ label }) => (
      <span>FooBar says {label} World!</span>
    )}
  </Fill>
)

const App = () => (
  <div>
    <Foo />
    <Bar />
    <FooBar />
  </div>
)
```

The HTML output will be:

```html
<div>
  <!-- <Foo /> -->
  <div>
    <span>Hello </span>
    <span>crazy World!</span>
    <span>FooBar says crazy World!</span>
  </div>
  <!-- <Bar /> -->
  <!-- <FooBar /> -->
</div>
```

### Wrapping fills in a `Slot`

The children of a `Slot` can be set as a function. This function will take as 1st argument an array of fills with the following properties:

- **props**: Props of the matched `Fill`
- **render([extra])**: Function to render the fill. Can take `extra` props and add to the fill children function props 

```jsx
import React from 'react'
import { Slot, Fill } from '@ehv/react-slots'

const Foo = () => (
  <div>
    <span>Hello </span>
    <Slot name='foo' label='crazy'>
      {fills => (
        <ul>
          {fills.map((fill, index) => (
            <li key={index}>
              <span>{fill.props.prop}</span>
              {fill.render({ index })}
            </li>
          ))}
        </ul>
      )}
    </Slot>
  </div>
)

const Bar = () => (
  <React.Fragment>
    <Fill slot='foo' prop='foo'>
      {({ label, index }) => (
        <span>{index}: First Bar {label} World!</span>
      )}
    </Fill>
    <Fill slot='foo' prop='bar'>
      {({ label, index }) => (
        <span>{index}: Second Bar {label} World!</span>
      )}
    </Fill>
  </React.Fragment>
)

const FooBar = () => (
  <Fill slot='foo' prop='foobar'>
    {({ label }) => (
      <span>The only FooBar {label} World!</span>
    )}
  </Fill>
)

const App = () => (
  <div>
    <Foo />
    <Bar />
    <FooBar />
  </div>
)
```

The HTML output will be:

```html
<div>
  <!-- <Foo /> -->
  <div>
    <span>Hello </span>
    <ul>
      <li>
        <span>foo</span>
        <span>0: First Bar crazy World!</span>
      </li>
      <li>
        <span>bar</span>
        <span>1: Second Bar crazy World!</span>
      </li>
      <li>
        <span>foobar</span>
        <span>The only FooBar crazy World!</span>
      </li>
    </ul>
    <span>crazy World!</span>
  </div>
  <!-- <Bar /> -->
  <!-- <FooBar /> -->
</div>
```

### Using `Slot`s and `Fill`s as declarative extension point for your app

`Slot`s and `Fill`s can be used to create and expose a declarative API to other parts of the component tree. 

#### Using `Slot` wrapped fills

```jsx
import React from 'react'
import { Slot, Fill } from '@ehv/react-slots'

class KeyboardJSBind extends React.PureComponent {
  componentDidMount () {
    keyboardJS.bind(this.props.keys, this.props.onAction)
  }
  componentDidUpdate (prevProps) {
    keyboardJS.unbind(prevProps.keys, prevProps.onAction)
    keyboardJS.bind(this.props.keys, this.props.onAction)
  }
  componentWillUnmount () {
    keyboardJS.unbind(this.props.keys, this.props.onAction)
  }
  render () {
    return null
  }
}

const Keybindings = () => (
  <Slot name='keybindings'>
    {fills => fills.map((fill, index) => (
      <KeyboardJSBind {...fill.props} key={index} />
    ))}
  </Slot>
)

const Keybind = props => (
  <Fill {...props} slot='keybindings' />
)

const Plugin = () => (
  <Keybind keys='ctrl+s' onAction={() => console.log('pressed!')} />
)

const App = () => (
  <div>
    <Keybindings />
    <Plugin />
  </div>
)
```

#### Using `Slot` `onFills`

```jsx
import React from 'react'
import { Slot, Fill } from '@ehv/react-slots'

class Core extends React.PureComponent {
  state = {
    extensions: []
  }

  onFills = extensions => {
    this.setState({ extensions })
  }

  render () {
    return (
      <div>
        <Slot name='extensions' onFills={this.onFills} />
        {this.state.extensions.map((extension, index) => {
          ...
        })}
      </div>
    )
  }
}

const Extension = props => (
  <Fill {...props} slot='extensions' />
)

const PluginA = () => (
  <React.Fragment>
    <Extension id='extensionA1' value='value1' fnValue={() => { ... }} />
    <Extension id='extensionA2' value='value2' fnValue={() => { ... }} />
  </React.Fragment>
)

const PluginB = () => (
  <Extension id='extensionB1' value='value1' fnValue={() => { ... }} />
)

const App = () => (
  <div>
    <Core />
    <PluginA />
    <PluginB />
  </div>
)
```
