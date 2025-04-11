import React from 'react'
import { storiesOf } from '@storybook/react'

import { Fixed } from './Fixed'
import Button from '../Button'

storiesOf('Fixed', module)
  .addDecorator(storyFn => (
    <div style={{ width: '100%', height: '150vh' }}>{storyFn()}</div>
  ))
  .addParameters({ component: Fixed })
  .add('default', () => (
    <>
      <Fixed
        top='0'
        left='0'
        style={{ width: '100%', backgroundColor: 'blue', color: 'white' }}
      >
        Fixed Content
      </Fixed>
      <Fixed bottom='0' right='0'>
        <Button>Fixed Button</Button>
      </Fixed>
    </>
  ))
