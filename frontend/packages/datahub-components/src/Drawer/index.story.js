import '@wessberg/pointer-events'

import React from 'react'
import { storiesOf } from '@storybook/react'

import Drawer from './Drawer'
import DrawerContent from './DrawerContent'
import DrawerResizer from './DrawerResizer'

storiesOf('Drawer', module)
  .addParameters({
    component: Drawer,
    subcomponents: { DrawerContent, DrawerResizer }
  })
  .addDecorator(story => (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'grey'
      }}
    >
      {story()}
    </div>
  ))
  .add('Default', () => <Drawer />)
  .add('Snapping', () => <Drawer snapping={[1, 0.5, 0.2, 0]} />)
  .add('Minimum', () => <Drawer isMinimum />)
