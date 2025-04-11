import React from 'react'
import { storiesOf } from '@storybook/react'

import { Tabs } from './Tabs'
import TabPanel from './TabPanel'

const tabs = [
  {
    name: 'Wesco Refinery',
    content: <div>content tab 1</div>
  },
  {
    name: 'Hyperloop LA',
    content: <div>content tab 2</div>
  },
  {
    name: 'Treasure Island',
    content: <div>content tab 3</div>
  }
]

storiesOf('Tabs', module)
  .addParameters({
    component: Tabs,
    subcomponents: { TabPanel }
  })
  .addDecorator(storyFn => (
    <div
      style={{
        margin: '10px',
        minHeight: '800px',
        padding: '10px',
        backgroundColor: 'gray'
      }}
    >
      {storyFn()}
    </div>
  ))
  .add('three tabs', () => (
    <Tabs
      tabs={tabs.map((tab, index) => (
        <Tabs.Tab key={index}>{tab.name}</Tabs.Tab>
      ))}
    >
      {tabs.map(tab => (
        <Tabs.TabPanel>{tab.content}</Tabs.TabPanel>
      ))}
    </Tabs>
  ))
