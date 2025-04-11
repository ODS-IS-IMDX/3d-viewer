import React from 'react'
import { storiesOf } from '@storybook/react'
import { Box, Flex, Text } from '@ehv/design-system'
import { IconStateVisible } from '@ehv/datahub-icons'

import List from '../List'
import ListItem from './ListItem'

const sites = [
  {
    name: 'Wesco Refinery',
    location: 'San Francisco, CA, USA'
  },
  {
    name: 'Hyperloop LA',
    location: 'Los Angeles, CA, USA'
  },
  {
    name: '美浜',
    location: '美浜市, 千葉県, 日本'
  }
]

const selectedSiteIndex = 0

storiesOf('List', module)
  .addParameters({
    component: List,
    subcomponents: { ListItem }
  })
  .add('Default', () => (
    <List variant='default'>
      {sites.map((site, index) => (
        <List.Item selected={index === selectedSiteIndex} key={index}>
          <Flex alignItems='center' style={{ height: 40 }}>
            <Box flex={1} ml={40}>
              <Text style={{ fontSize: 12 }}>{site.name}</Text>
            </Box>
            <IconStateVisible onClick={null} />
          </Flex>
        </List.Item>
      ))}
    </List>
  ))
  .add('Variant menu', () => (
    <List variant='menu'>
      {sites.map((site, index) => (
        <List.Item selected={index === selectedSiteIndex} key={index}>
          <Flex alignItems='center' style={{ height: 40 }}>
            <Box flex={1} ml={40}>
              <Text style={{ fontSize: 12 }}>{site.name}</Text>
            </Box>
            <IconStateVisible onClick={null} />
          </Flex>
        </List.Item>
      ))}
    </List>
  ))
  .add('Variant drawer', () => (
    <List variant='drawer'>
      {sites.map((site, index) => (
        <List.Item selected={index === selectedSiteIndex} key={index}>
          <Flex alignItems='center' style={{ height: 40 }}>
            <Box flex={1} ml={40}>
              <Text style={{ fontSize: 12 }}>{site.name}</Text>
            </Box>
            <IconStateVisible onClick={null} />
          </Flex>
        </List.Item>
      ))}
    </List>
  ))
  .add('Variant modal', () => (
    <List variant='modal'>
      {sites.map((site, index) => (
        <List.Item selected={index === selectedSiteIndex} key={index}>
          <Flex alignItems='center' style={{ height: 40 }}>
            <Box flex={1} ml={40}>
              <Text style={{ fontSize: 12 }}>{site.name}</Text>
            </Box>
            <IconStateVisible onClick={null} />
          </Flex>
        </List.Item>
      ))}
    </List>
  ))
  .add('Variant list', () => (
    <List variant='list'>
      {sites.map((site, index) => (
        <List.Item selected={index === selectedSiteIndex} key={index}>
          <Flex alignItems='center' style={{ height: 40 }}>
            <Box flex={1} ml={40}>
              <Text style={{ fontSize: 12 }}>{site.name}</Text>
            </Box>
            <IconStateVisible onClick={null} />
          </Flex>
        </List.Item>
      ))}
    </List>
  ))
