// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'

export type FillProps = {
  children?: React.Node | ((props?: {}) => React.Node)
}

export type MountFunc = (slot: string, props: {}) => number
export type UpdateFunc = (id: number, slot: string, props: {}) => void
export type UnmountFunc = (id: number) => void

export type ProviderContext = {
  fills: {
    [id: number]: string
  },
  slots: {
    [slot: string]: {
      [id: number]: FillProps
    }
  },
  mount: MountFunc,
  update: UpdateFunc,
  unmount: UnmountFunc
}

type ProviderProps = {
  children: ?React.Node
}

export const Context = React.createContext<ProviderContext>({
  fills: {},
  slots: {},
  mount: (slot, props) => 0,
  update: (id, slot, props) => {},
  unmount: id => {}
})

let nextId = 0

export class Provider extends React.PureComponent<
  ProviderProps,
  ProviderContext
> {
  mount = (slot: string, props: {}) => {
    const id = nextId++
    this.setState(state => ({
      fills: {
        ...state.fills,
        [id]: slot
      },
      slots: {
        ...state.slots,
        [slot]: {
          ...state.slots[slot],
          [id]: props
        }
      }
    }))
    return id
  }

  update = (id: number, slot: string, props: {}) => {
    this.setState(state => ({
      fills: {
        ...state.fills,
        [id]: slot
      },
      slots: {
        ...state.slots,
        [slot]: {
          ...state.slots[slot],
          [id]: props
        }
      }
    }))
  }

  unmount = (id: number) => {
    this.setState(state => {
      const { [id]: slot, ...fills } = state.fills
      const { [id]: _, ...fillsBySlot } = state.slots[slot]
      return {
        fills,
        slots: {
          ...state.slots,
          [slot]: fillsBySlot
        }
      }
    })
  }

  state = {
    fills: {},
    slots: {},
    mount: this.mount,
    update: this.update,
    unmount: this.unmount
  }

  render () {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    )
  }
}

export const Consumer = Context.Consumer

export default {
  Provider: Provider,
  Consumer: Context.Consumer
}
