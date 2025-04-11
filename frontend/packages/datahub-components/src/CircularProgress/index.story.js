import React from 'react'
import { storiesOf } from '@storybook/react'

import CircularProgress from '.'

storiesOf('CircularProgress', module)
  .addParameters({ component: CircularProgress })
  .addDecorator(storyFn => (
    <div
      style={{
        margin: '10px',
        width: '50px',
        padding: '10px',
        backgroundColor: '#fff'
      }}
    >
      {storyFn()}
    </div>
  ))
  .add('Simple layout', () => (
    <div>
      <CircularProgress progress={0} />
      <CircularProgress progress={10} />
      <CircularProgress progress={20} />
      <CircularProgress progress={50} />
      <CircularProgress progress={80} />
      <CircularProgress progress={100} />
    </div>
  ))
