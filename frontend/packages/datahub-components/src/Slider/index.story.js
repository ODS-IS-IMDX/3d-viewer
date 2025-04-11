import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'

import Slider from './Slider'

const SliderContainer = ({ format, label, unit }) => {
  const [value, setValue] = useState(50)
  return (
    <Slider
      format={format}
      onChange={setValue}
      max={100}
      min={0}
      unit='%'
      label={label}
      value={value}
    />
  )
}

storiesOf('Slider', module)
  .addParameters({ component: Slider })
  .add('Default', () => <SliderContainer max={100} min={0} />)
  .add('Default with label', () => <SliderContainer label='Opacity' unit='%' />)
  .add('Default with format', () => (
    <SliderContainer format={value => value * 2} label='Opacity' unit='%' />
  ))
