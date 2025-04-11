import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { MapMore } from './MapMore'
import { ContextMenu } from '../ContextMenu'

storiesOf('MapMore', module)
  .addParameters({ component: MapMore })
  .addDecorator(story => (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: 'grey' }}>
      {story()}
    </div>
  ))
  .add('Default menu top', () => (
    <MapMore
      onChange={selectedValue => action(`click: ${selectedValue}`)}
      top={100}
      right={200}
    >
      <ContextMenu>
        <ContextMenu.Item value={100}>Test 1</ContextMenu.Item>
        <ContextMenu.Item value={200}>
          A longer text for the item
        </ContextMenu.Item>
        <ContextMenu.Item value={300}>Test 3</ContextMenu.Item>
      </ContextMenu>
    </MapMore>
  ))
