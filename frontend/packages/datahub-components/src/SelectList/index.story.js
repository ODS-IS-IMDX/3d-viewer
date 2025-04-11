import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import SelectList from './SelectList'
import SelectListItem from './SelectListItem'

import { Box, Flex, Text } from '@ehv/design-system'
import { IconStateVisible } from '@ehv/datahub-icons'

const sites = [
  {
    name: 'Wesco Refinery',
    location: 'San Francisco, CA, USA'
  },
  {
    name: 'Hyperloop LA',
    location: 'Los Angeles, CA, USA'
  }
]

const selected = sites[0]

const SelectListItemObj = props => (
  <SelectList.Item
    selected={props.selected === props.site}
    onChange={action('onChange')}
  >
    <Flex alignItems='center' style={{ height: 40 }}>
      <Box flex={1} ml={40}>
        <Text style={{ fontSize: 12 }}>Disabled item name</Text>
      </Box>
      <IconStateVisible onClick={null} />
    </Flex>
  </SelectList.Item>
)

storiesOf('SelectList', module)
  .addParameters({
    component: SelectList,
    subcomponents: { SelectListItem }
  })
  .addDecorator(story => (
    <div style={{ width: '80vw', height: '100vh', backgroundColor: 'fff' }}>
      {story()}
    </div>
  ))
  .add('Default', () => (
    <SelectList>
      {sites.map((site, index) => (
        <SelectListItemObj selected={selected} site={site} key={index} />
      ))}
    </SelectList>
  ))
