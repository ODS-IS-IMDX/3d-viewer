import React from 'react'
import styled from 'styled-components'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import Box from '../Box'
import Grid from '../Grid'
import { Button } from './Button'
import { IconOpenLibrary } from '../../../datahub-icons'

const IconWrapper = styled(Box)`
  padding: 10px;
  width: 40px;
  height: 40px;
`

storiesOf('Button', module)
  .addParameters({ component: Button })
  .add('All', () => (
    <Grid columns={3} style={{ width: '800px' }}>
      <Button>Primary</Button>
      <Button hover>Primary hover</Button>
      <Button loading>Primary loading</Button>
      <Button variant='secondary'>Secondary</Button>
      <Button variant='secondary' hover>
        Secondary hover
      </Button>
      <Button variant='secondary' loading>
        Secondary loading
      </Button>
      <Button disabled>Disabled</Button>
      <Button disabled hover>
        Disabled hover
      </Button>
      <Button variant='dark'>Dark</Button>
      <Button variant='round'>Round</Button>
      <Button variant='icon' style={{ width: '100px', height: '100px' }}>
        <IconWrapper>
          <IconOpenLibrary />
        </IconWrapper>
      </Button>
      <Button variant='minimal'>Minimal</Button>
      <Button
        fontWeigh='bold'
        border='3px solid'
        borderColor='green'
        borderRadius={3}
      >
        With styles
      </Button>
      <Button color='success'>Success</Button>
      <Button color='success' hover>
        Success hover
      </Button>
      <Button color='warning'>Warning</Button>
      <Button color='warning' hover>
        Warning hover
      </Button>
      <Button color='info'>Info</Button>
      <Button color='info' hover>
        Info hover
      </Button>
    </Grid>
  ))
  .add('Primary', () => <Button variant='primary'>Primary</Button>)
  .add('Primary hover', () => (
    <Button variant='primary' hover>
      Primary hover
    </Button>
  ))
  .add('Primary loading', () => (
    <Button variant='primary' loading>
      Primary loading
    </Button>
  ))
  .add('Secondary', () => <Button variant='secondary'>Secondary</Button>)
  .add('Secondary hover', () => (
    <Button variant='secondary' hover>
      Secondary hover
    </Button>
  ))
  .add('Secondary loading', () => (
    <Button variant='secondary' loading>
      Secondary loading
    </Button>
  ))
  .add('Disabled', () => <Button disabled>Disabled</Button>)
  .add('Disabled hover', () => (
    <Button disabled hover>
      Disabled hover
    </Button>
  ))
  .add('Dark', () => <Button variant='dark'>Dark</Button>)
  .add('Round', () => <Button variant='round'>Round</Button>)
  .add('Icon', () => (
    <Button variant='icon' style={{ width: '100px', height: '100px' }}>
      <IconWrapper>
        <IconOpenLibrary />
      </IconWrapper>
    </Button>
  ))
  .add('Minimal', () => <Button variant='round'>Minimal</Button>)
  .add('With styles', () => (
    <Button
      fontWeigh='bold'
      border='3px solid'
      borderColor='green'
      borderRadius={3}
      onClick={action('onClick')}
    >
      With styles
    </Button>
  ))
  .add('Success', () => <Button color='success'>Success</Button>)
  .add('Success hover', () => (
    <Button color='success' hover>
      Success hover
    </Button>
  ))
  .add('Warning', () => <Button color='warning'>Warning</Button>)
  .add('Warning hover', () => (
    <Button color='warning' hover>
      Warning hover
    </Button>
  ))
  .add('Info', () => <Button color='info'>Info</Button>)
  .add('Info hover', () => (
    <Button color='info' hover>
      Info hover
    </Button>
  ))
