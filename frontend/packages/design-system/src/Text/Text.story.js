import React from 'react'
import { storiesOf } from '@storybook/react'

import Box from '../Box'
import Text from '.'
import { theme } from './Text'

storiesOf('Text', module)
  .addParameters({ component: Text })
  .add('All', () => (
    <Box>
      <Text>Default text is using Source Sans Pro Regular at 12px.</Text>
      <Text size={0}>{getSizeText(theme.sizes[0])}</Text>
      <Text size={1}>{getSizeText(theme.sizes[1])}</Text>
      <Text size={2}>{getSizeText(theme.sizes[2])}</Text>
      <Text size={3}>{getSizeText(theme.sizes[3])}</Text>
      <Text size={4}>{getSizeText(theme.sizes[4])}</Text>
      <Text size={5}>{getSizeText(theme.sizes[5])}</Text>
      <Text size={6}>{getSizeText(theme.sizes[6])}</Text>
      <Text size={7}>{getSizeText(theme.sizes[7])}</Text>
      <Text size={8}>{getSizeText(theme.sizes[8])}</Text>
    </Box>
  ))
  .add('Default', () => (
    <Text>Default text is using Source Sans Pro Regular at 12px.</Text>
  ))
  .add('Size 0', () => <Text size={0}>{getSizeText(theme.sizes[0])}</Text>)
  .add('Size 1', () => <Text size={1}>{getSizeText(theme.sizes[1])}</Text>)
  .add('Size 2', () => <Text size={2}>{getSizeText(theme.sizes[2])}</Text>)
  .add('Size 3', () => <Text size={3}>{getSizeText(theme.sizes[3])}</Text>)
  .add('Size 4', () => <Text size={4}>{getSizeText(theme.sizes[4])}</Text>)
  .add('Size 5', () => <Text size={5}>{getSizeText(theme.sizes[5])}</Text>)
  .add('Size 6', () => <Text size={6}>{getSizeText(theme.sizes[6])}</Text>)
  .add('Size 7', () => <Text size={7}>{getSizeText(theme.sizes[7])}</Text>)
  .add('Size 8', () => <Text size={8}>{getSizeText(theme.sizes[8])}</Text>)
  .add('With styles', () => (
    <Text
      size={4}
      fontWeight='bold'
      color='blue'
      lineHeight={3}
      textAlign='center'
    >
      size=4 fontWeight='bold' color='blue' lineHeight=3 textAlign='center'
    </Text>
  ))

const getSizeText = size => {
  let text = ''
  text += size.fontSize ? `font size: ${size.fontSize} / ` : ''
  text += size.fontWeight ? `font weight: ${size.fontWeight} / ` : ''
  text += size.lineHeight ? `line height: ${size.lineHeight}` : ''

  return text
}
