import React from 'react'
import styled from 'styled-components'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Box, Flex, Text } from '@ehv/design-system'
import {
  IconSite,
  IconDate,
  IconLayers,
  IconOpenLibrary,
  IconStateVisible
} from '@ehv/datahub-icons'

import List from '../List'
import Accordion from './Accordion'
import AccordionItem from './AccordionItem'
import AccordionItemContent from './AccordionItemContent'
import AccordionItemHeader from './AccordionItemHeader'

const IconWrapper = styled(Box)`
  width: 40px;
  height: 40px;
  padding: 10px;
`

storiesOf('Accordion', module)
  .addParameters({
    component: Accordion,
    subcomponents: { AccordionItem, AccordionItemContent, AccordionItemHeader }
  })
  .add('Default', () => (
    <Accordion variant='default'>
      <Accordion.Item
        header={props => (
          <Accordion.Item.Header {...props} Icon={IconSite}>
            <Text flex={1} fontSize={14}>
              Westco Refinery
            </Text>
            <IconWrapper>
              <IconOpenLibrary onClick={action('onClick-icon')} />
            </IconWrapper>
          </Accordion.Item.Header>
        )}
      >
        Content 1
      </Accordion.Item>
      <Accordion.Item
        header={props => (
          <Accordion.Item.Header {...props} Icon={IconDate}>
            <Text flex={1} fontSize={14}>
              Jun 30, 2019
            </Text>
            <IconWrapper>
              <IconOpenLibrary onClick={action('onClick-icon')} />
            </IconWrapper>
          </Accordion.Item.Header>
        )}
      >
        <div style={{ height: '200px', backgroundColor: 'red' }}>Content 2</div>
      </Accordion.Item>
      <Accordion.Item
        header={props => (
          <Accordion.Item.Header {...props} Icon={IconLayers}>
            <Text flex={1} fontSize={14}>
              Data layers (5)
            </Text>
            <IconWrapper>
              <IconOpenLibrary onClick={action('onClick-icon')} />
            </IconWrapper>
          </Accordion.Item.Header>
        )}
      >
        <List>
          <List.Item selected style={{ fontSize: 12 }}>
            <Flex alignItems='center'>
              <Box flex={1} ml={40}>
                <Text>Point Cloud</Text>
              </Box>
              <IconStateVisible />
            </Flex>
          </List.Item>
          <List.Item style={{ fontSize: 12 }}>
            <Flex alignItems='center'>
              <Box flex={1} ml={40}>
                <Text>Contour</Text>
              </Box>
              <IconStateVisible />
            </Flex>
          </List.Item>
          <List.Item style={{ fontSize: 12 }}>
            <Flex alignItems='center'>
              <Box flex={1} ml={40}>
                <Text>2D Ortho</Text>
              </Box>
              <IconStateVisible />
            </Flex>
          </List.Item>
        </List>
      </Accordion.Item>
    </Accordion>
  ))
  .add('Variant menu', () => (
    <Accordion variant='menu'>
      <Accordion.Item
        header={props => (
          <Accordion.Item.Header {...props} Icon={IconSite}>
            <Text flex={1} fontSize={14}>
              Westco Refinery
            </Text>
            <IconWrapper>
              <IconOpenLibrary onClick={action('onClick-icon')} />
            </IconWrapper>
          </Accordion.Item.Header>
        )}
      >
        Content 1
      </Accordion.Item>
      <Accordion.Item
        header={props => (
          <Accordion.Item.Header {...props} Icon={IconDate}>
            <Text flex={1} fontSize={14}>
              Jun 30, 2019
            </Text>
            <IconWrapper>
              <IconOpenLibrary onClick={action('onClick-icon')} />
            </IconWrapper>
          </Accordion.Item.Header>
        )}
      >
        <div style={{ height: '200px', backgroundColor: 'red' }}>Content 2</div>
      </Accordion.Item>
      <Accordion.Item
        header={props => (
          <Accordion.Item.Header {...props} Icon={IconLayers}>
            <Text flex={1} fontSize={14}>
              Data layers (5)
            </Text>
            <IconWrapper>
              <IconOpenLibrary onClick={action('onClick-icon')} />
            </IconWrapper>
          </Accordion.Item.Header>
        )}
      >
        <List>
          <List.Item selected style={{ fontSize: 12 }}>
            <Flex alignItems='center'>
              <Box flex={1} ml={40}>
                <Text>Point Cloud</Text>
              </Box>
              <IconStateVisible />
            </Flex>
          </List.Item>
          <List.Item style={{ fontSize: 12 }}>
            <Flex alignItems='center'>
              <Box flex={1} ml={40}>
                <Text>Contour</Text>
              </Box>
              <IconStateVisible />
            </Flex>
          </List.Item>
          <List.Item style={{ fontSize: 12 }}>
            <Flex alignItems='center'>
              <Box flex={1} ml={40}>
                <Text>2D Ortho</Text>
              </Box>
              <IconStateVisible />
            </Flex>
          </List.Item>
        </List>
      </Accordion.Item>
    </Accordion>
  ))
  .add('Variant submenu', () => (
    <Accordion variant='submenu'>
      <Accordion.Item
        header={props => (
          <Accordion.Item.Header {...props} Icon={IconSite}>
            <Text flex={1} fontSize={14}>
              Westco Refinery
            </Text>
            <IconWrapper>
              <IconOpenLibrary onClick={action('onClick-icon')} />
            </IconWrapper>
          </Accordion.Item.Header>
        )}
      >
        Content 1
      </Accordion.Item>
      <Accordion.Item
        header={props => (
          <Accordion.Item.Header {...props} Icon={IconDate}>
            <Text flex={1} fontSize={14}>
              Jun 30, 2019
            </Text>
            <IconWrapper>
              <IconOpenLibrary onClick={action('onClick-icon')} />
            </IconWrapper>
          </Accordion.Item.Header>
        )}
      >
        <div style={{ height: '200px', backgroundColor: 'red' }}>Content 2</div>
      </Accordion.Item>
      <Accordion.Item
        header={props => (
          <Accordion.Item.Header {...props} Icon={IconLayers}>
            <Text flex={1} fontSize={14}>
              Data layers (5)
            </Text>
            <IconWrapper>
              <IconOpenLibrary onClick={action('onClick-icon')} />
            </IconWrapper>
          </Accordion.Item.Header>
        )}
      >
        <List>
          <List.Item selected style={{ fontSize: 12 }}>
            <Flex alignItems='center'>
              <Box flex={1} ml={40}>
                <Text>Point Cloud</Text>
              </Box>
              <IconStateVisible />
            </Flex>
          </List.Item>
          <List.Item style={{ fontSize: 12 }}>
            <Flex alignItems='center'>
              <Box flex={1} ml={40}>
                <Text>Contour</Text>
              </Box>
              <IconStateVisible />
            </Flex>
          </List.Item>
          <List.Item style={{ fontSize: 12 }}>
            <Flex alignItems='center'>
              <Box flex={1} ml={40}>
                <Text>2D Ortho</Text>
              </Box>
              <IconStateVisible />
            </Flex>
          </List.Item>
        </List>
      </Accordion.Item>
    </Accordion>
  ))
  .add('複数メニューを同時に開く', () => (
    <Accordion variant='default' multiple>
      <Accordion.Item
        header={props => (
          <Accordion.Item.Header {...props} Icon={IconSite}>
            <Text flex={1} fontSize={14}>
              Westco Refinery
            </Text>
            <IconWrapper>
              <IconOpenLibrary onClick={action('onClick-icon')} />
            </IconWrapper>
          </Accordion.Item.Header>
        )}
      >
        Content 1
      </Accordion.Item>
      <Accordion.Item
        header={props => (
          <Accordion.Item.Header {...props} Icon={IconDate}>
            <Text flex={1} fontSize={14}>
              Jun 30, 2019
            </Text>
            <IconWrapper>
              <IconOpenLibrary onClick={action('onClick-icon')} />
            </IconWrapper>
          </Accordion.Item.Header>
        )}
      >
        <div style={{ height: '200px', backgroundColor: 'red' }}>Content 2</div>
      </Accordion.Item>
      <Accordion.Item
        header={props => (
          <Accordion.Item.Header {...props} Icon={IconLayers}>
            <Text flex={1} fontSize={14}>
              Data layers (5)
            </Text>
            <IconWrapper>
              <IconOpenLibrary onClick={action('onClick-icon')} />
            </IconWrapper>
          </Accordion.Item.Header>
        )}
      >
        <List>
          <List.Item selected style={{ fontSize: 12 }}>
            <Flex alignItems='center'>
              <Box flex={1} ml={40}>
                <Text>Point Cloud</Text>
              </Box>
              <IconStateVisible />
            </Flex>
          </List.Item>
          <List.Item style={{ fontSize: 12 }}>
            <Flex alignItems='center'>
              <Box flex={1} ml={40}>
                <Text>Contour</Text>
              </Box>
              <IconStateVisible />
            </Flex>
          </List.Item>
          <List.Item style={{ fontSize: 12 }}>
            <Flex alignItems='center'>
              <Box flex={1} ml={40}>
                <Text>2D Ortho</Text>
              </Box>
              <IconStateVisible />
            </Flex>
          </List.Item>
        </List>
      </Accordion.Item>
    </Accordion>
  ))
