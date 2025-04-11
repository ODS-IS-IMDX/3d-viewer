import React from 'react'
import { storiesOf } from '@storybook/react'

import { Absolute } from './Absolute'

storiesOf('Absolute', module)
  .addDecorator(storyFn => (
    <div style={{ width: '600px', height: '600px' }}>{storyFn()}</div>
  ))
  .addParameters({ component: Absolute })
  .add('default', () => (
    <Absolute top='50%' left='50%'>
      Absolute top 50%, left 50%
    </Absolute>
  ))
  .add('With styles (z-index)', () => (
    <>
      <Absolute top='50%' left='50%' zIndex={0}>
        <div
          style={{
            width: '200px',
            height: '200px',
            background: 'blue',
            color: 'white'
          }}
        >
          z-index 0
        </div>
      </Absolute>
      <Absolute top='60%' left='60%' zIndex={1}>
        <div
          style={{
            width: '200px',
            height: '200px',
            background: 'red',
            color: 'white'
          }}
        >
          z-index 1
        </div>
      </Absolute>
    </>
  ))
