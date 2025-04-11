import React from 'react'
import styled from 'styled-components'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import Radio from '../Radio'
import RadioGroup from './RadioGroup'
import { Flex } from '@ehv/design-system'

const RadioGroupWrapper = styled(Flex)`
  width: 600px;
  justify-content: space-between;
  margin-top: 20px;
  margin-left: 10px;
`

const RadioWrapper = styled(Radio)`
  margin-right: 10px;
`

storiesOf('RadioGroup', module)
  .addParameters({ component: RadioGroup })
  .add('Default', () => (
    <RadioGroupWrapper>
      <RadioGroup value='radio group' onChange={action('onChange')}>
        <label>
          <RadioWrapper name='renderQuality' value='low' />
          low
        </label>
        <label>
          <RadioWrapper name='renderQuality' value='standard' />
          standard
        </label>
        <label>
          <RadioWrapper name='renderQuality' value='high' />
          high
        </label>
      </RadioGroup>
    </RadioGroupWrapper>
  ))
