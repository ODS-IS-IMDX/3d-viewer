import React from 'react'
import { storiesOf } from '@storybook/react'

import * as icons from '../src'

storiesOf('Icons', module).add('default', () => (
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      width: '80%',
      margin: '100px',
      justifyContent: 'space-between'
    }}
  >
    {Object.entries(icons).map(([name, Icon], index) => (
      <div
        key={index}
        title={name}
        style={{ margin: '20px', padding: '20px', border: '1px solid #EEE' }}
      >
        <Icon />
      </div>
    ))}
  </div>
))
