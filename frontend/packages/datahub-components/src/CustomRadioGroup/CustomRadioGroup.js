// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import { Flex } from '@ehv/design-system'
import CustomRadio from './CustomRadio'

export type CustomRadioGroupProps = {
  children: Node,
  value: any,
  onChange: (value: any) => void
}

const Context = React.createContext('customRadioGroup')

export const CustomRadioGroup = ({
  children,
  value,
  onChange,
  ...props
}: CustomRadioGroupProps) => {
  return (
    <Context.Provider value={{ value, onChange }}>
      <Flex {...props}>{children}</Flex>
    </Context.Provider>
  )
}

CustomRadioGroup.Context = Context
CustomRadioGroup.Item = CustomRadio

export default CustomRadioGroup
