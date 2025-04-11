import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { FormInput } from './FormInput'

storiesOf('FormInput', module)
  .addParameters({ component: FormInput })
  .addDecorator(story => (
    <div
      style={{
        backgroundColor: '#fff',
        height: '100vh',
        width: '100vw',
        padding: '20px'
      }}
      onBlur={action('onBlur')}
      onChange={action('onChange')}
      onFocus={action('onFocus')}
    >
      {story()}
    </div>
  ))
  .add('Default', () => (
    <FormInput
      name='email'
      label='Email'
      value='Some value'
      onBlur={action('onBlur')}
      onChange={action('onChange')}
      onFocus={action('onFocus')}
    />
  ))
  .add('With no value', () => (
    <FormInput
      name='email'
      label='Email'
      value=''
      onBlur={action('onBlur')}
      onChange={action('onChange')}
      onFocus={action('onFocus')}
    />
  ))
  .add('With place holder', () => (
    <FormInput
      name='email'
      label='Email'
      placeholder='Place Holder'
      onBlur={action('onBlur')}
      onChange={action('onChange')}
      onFocus={action('onFocus')}
    />
  ))
  .add('With Error not touched', () => (
    <FormInput
      name='email'
      label='Email'
      value='Some value'
      error='An error here'
      onBlur={action('onBlur')}
      onChange={action('onChange')}
      onFocus={action('onFocus')}
    />
  ))
  .add('With Error touched', () => (
    <FormInput
      name='email'
      label='Email'
      value='Some value'
      error='An error here'
      touched
      onBlur={action('onBlur')}
      onChange={action('onChange')}
      onFocus={action('onFocus')}
    />
  ))
  .add('With Disabled', () => (
    <FormInput
      name='email'
      label='Email'
      disabled
      onBlur={action('onBlur')}
      onChange={action('onChange')}
      onFocus={action('onFocus')}
    />
  ))
