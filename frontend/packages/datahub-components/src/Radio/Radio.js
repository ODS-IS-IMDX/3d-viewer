// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import { Radio as DSRadio } from '@ehv/design-system'

import RadioGroup from '../RadioGroup'

export type RadioProps = {
  value: any,
  checked: boolean
}

export const Radio = (props: RadioProps) => (
  <RadioGroup.Context.Consumer>
    {({ value, onChange }) => (
      <DSRadio
        {...props}
        checked={value === props.value || props.checked}
        onChange={onChange}
      />
    )}
  </RadioGroup.Context.Consumer>
)

export default Radio
