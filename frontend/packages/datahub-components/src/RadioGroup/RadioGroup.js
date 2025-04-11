// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { PureComponent, type Node } from 'react'

export const Context = React.createContext<Object>()

export type RadioGroupProps = {
  value: any,
  onChange: Event => void,
  children: Node
}

export class RadioGroup extends PureComponent<RadioGroupProps> {
  static Context = Context

  render () {
    const { value, onChange, children } = this.props
    return (
      <Context.Provider value={{ value, onChange }}>
        {children}
      </Context.Provider>
    )
  }
}

export default RadioGroup
