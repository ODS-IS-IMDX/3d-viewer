import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { Dropdown } from './Dropdown'
import DropdownControl from './DropdownControl'
import DropdownIndicator from './DropdownIndicator'
import DropdownItem from './DropdownItem'
import DropdownMenu from './DropdownMenu'
import DropdownMenuList from './DropdownMenuList'
import DropdownPlaceholder from './DropdownPlaceholder'
import DropdownSingleValue from './DropdownSingleValue'
import { DropdownWithIcon } from './DropdownWithIcon'

storiesOf('Dropdown', module)
  .addParameters({
    component: Dropdown,
    subcomponents: {
      DropdownControl,
      DropdownIndicator,
      DropdownItem,
      DropdownMenu,
      DropdownMenuList,
      DropdownPlaceholder,
      DropdownSingleValue,
      DropdownWithIcon
    }
  })
  .addDecorator(story => (
    <div
      style={{
        backgroundColor: '#fff',
        height: '100vh',
        width: '80vw',
        padding: '20px'
      }}
    >
      {story()}
    </div>
  ))
  .add('Default', () => (
    <Dropdown
      name='country'
      options={[
        { label: 'USA', value: 1 },
        { label: 'Romania', value: 2 }
      ]}
      onChange={action('onChange')}
    />
  ))
  .add('Default searchable', () => (
    <Dropdown
      name='country'
      options={[
        { label: 'USA', value: 1 },
        { label: 'Romania', value: 2 }
      ]}
      isSearchable
      onChange={action('onChange')}
    />
  ))
  .add('Default disabled', () => (
    <Dropdown
      name='country'
      options={[
        { label: 'USA', value: 1 },
        { label: 'Romania', value: 2 }
      ]}
      isDisabled
      onChange={action('onChange')}
    />
  ))
  .add('Default with label', () => (
    <Dropdown
      name='country'
      menuIsOpen
      label='Countries'
      options={[
        { label: 'USA', value: 1 },
        { label: 'Romania', value: 2 }
      ]}
      onChange={action('onChange')}
    />
  ))
  .add('Default with label and more than 4 items', () => (
    <Dropdown
      name='country'
      label='Countries'
      placeholder='Select a Country...'
      maxMenuHeight={160}
      menuIsOpen
      options={[
        { label: 'USA', value: 1 },
        { label: 'Romania', value: 2 },
        { label: 'Ireland', value: 3 },
        { label: 'Italy', value: 4 },
        { label: 'France', value: 5 },
        { label: 'UK', value: 6 },
        { label: 'Germany', value: 7 }
      ]}
      onChange={action('onChange')}
    />
  ))
  .add('Default with customise with', () => (
    <Dropdown
      name='country'
      options={[
        {
          label: 'United Kingdom of Great Britain and Northern Ireland',
          value: 1
        },
        { label: 'Japan', value: 2 }
      ]}
      menuWidth='fit-content'
      onChange={action('onChange')}
    />
  ))
