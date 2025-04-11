import '@wessberg/pointer-events'

import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import CustomRadioGroup from './CustomRadioGroup'
import CustomRadio from './CustomRadio'

storiesOf('CustomRadioGroup', module)
  .addParameters({
    component: CustomRadioGroup,
    subcomponents: { CustomRadio }
  })
  .add('Default', () => (
    <CustomRadioGroup value={2} onChange={action('onChange')}>
      <CustomRadioGroup.Item label='1日' value={1} />
      <CustomRadioGroup.Item label='3日' value={2} />
      <CustomRadioGroup.Item label='1週間' value={3} />
      <CustomRadioGroup.Item label='2週間' value={4} />
      <CustomRadioGroup.Item label='1か月' value={5} />
      <CustomRadioGroup.Item label='6か月' value={6} />
      <CustomRadioGroup.Item label='1年' value={7} />
    </CustomRadioGroup>
  ))
