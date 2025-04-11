// Copyright (c) 2025 NTT InfraNet
// @flow
/**
 * MEMO
 * Selectコンポーネントを使用すると以下のwarningが表示されるため、react-selectのバージョンアップが必要。
 *
 * Warning: componentWillReceiveProps has been renamed, and is not recommended for use. See https://fb.me/react-unsafe-component-lifecycles for details.
 * Move data fetching code or side effects to componentDidUpdate.
 * If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://fb.me/react-derived-state
 * Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 17.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run `npx react-codemod rename-unsafe-lifecycles` in your project source folder. Please update the following components: Select
 */
import * as React from 'react'
import Select from 'react-select'
import type { OptionsType } from 'react-select/lib/types'
import styled from 'styled-components'
import { Box, themed } from '@ehv/design-system'

import theme from './theme'
import DropdownControl from './DropdownControl'
import DropdownItem from './DropdownItem'
import DropdownIndicator from './DropdownIndicator'
import DropdownMenu from './DropdownMenu'
import DropdownMenuList from './DropdownMenuList'
import DropdownPlaceholder from './DropdownPlaceholder'
import DropdownSingleValue from './DropdownSingleValue'

export type DropdownProps = {
  name: string,
  label?: string,
  variant?: string,
  options?: OptionsType,
  maxMenuHeight?: number,
  menuWidth?: number | string,
  isSearchable?: boolean,
  isDisabled?: boolean,
  menuPortalTarget?: HTMLElement,
  onMenuOpen?: () => void,
  onChange: (options: OptionsType) => void
}

const Label = styled.label`
  display: block;
  margin-bottom: 7px;
  ${// $FlowFixMe
  themed('Dropdown.Label', theme.Label)};
`

export class Dropdown extends React.PureComponent<DropdownProps> {
  static defaultProps = {
    maxMenuHeight: 160,
    options: [],
    value: null,
    variant: 'default',
    isSearchable: false,
    isDisabled: false
  }

  render () {
    const { label, name, variant, onMenuOpen, ...props } = this.props

    return (
      <Box {...props}>
        {label && <Label htmlFor={name}>{label}</Label>}
        <Select
          autosize
          {...props}
          onMenuOpen={onMenuOpen}
          components={{
            Control: DropdownControl,
            Menu: DropdownMenu,
            MenuList: DropdownMenuList,
            Option: DropdownItem,
            IndicatorSeparator: null,
            DropdownIndicator: DropdownIndicator,
            Placeholder: DropdownPlaceholder,
            SingleValue: DropdownSingleValue
          }}
        />
      </Box>
    )
  }
}
