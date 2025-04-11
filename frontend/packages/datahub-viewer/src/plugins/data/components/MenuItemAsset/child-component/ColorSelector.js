// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { useState } from 'react'
import styled from 'styled-components'
import { Box, Dropdown, Flex, Text } from '@ehv/datahub-components'

import type { AssetID } from 'plugins/asset/reducer'

const StyledFlex = styled(Flex)`
  width: 100%;
  margin: 8px 8px 8px 0;
`
const TextWrapper = styled(Flex)`
  flex: 1;
  max-width: 130px;
`
const DropdownWrapper = styled.div`
  margin-left: 24px;
  width: ${({ isMobile }) => (isMobile ? 180 : 120)}px;
`

export type DropdownColorOptionType = {
  label: React.Element<any>,
  value: string
}
const BoxWrapper: any = styled(Box)`
  ${({ color }) =>
    `background-color: ${color};
    border-color: black;
    border-style: solid;
    border-width: thin;
    `}
  width: 20px;
  height: 20px;
`
const COLOR_LIST = [
  '#FF0000',
  '#800000',
  '#FF00FF',
  '#800080',
  '#00FF00',
  '#008000',
  '#808000',
  '#0000FF',
  '#000080',
  '#00FFFF',
  '#008080',
  '#EDEDED',
  '#C0C0C0',
  '#808080',
  '#000000'
]
const iconColorSelectOptions: Array<DropdownColorOptionType> = COLOR_LIST.map(
  color => {
    return { label: <BoxWrapper color={color} />, value: color }
  }
)

type ColorSelectorProps = {
  id: AssetID,
  selectorLabel: string,
  defaultValueLabel: string,
  value: string,
  isMobile: boolean,
  onChange: (option: DropdownColorOptionType) => void
}
const Selector = (props: ColorSelectorProps) => {
  const { selectorLabel, defaultValueLabel, value, isMobile, onChange } = props
  const iconColorSelectOptionList = [
    {
      label: (
        <Text py={2} fontSize={1} flex={1}>
          {defaultValueLabel}
        </Text>
      ),
      value: ''
    },
    ...iconColorSelectOptions
  ]
  const [selectedOption, setSelectedOption] = useState(
    iconColorSelectOptionList.find(option => option.value === value) ||
      iconColorSelectOptionList[0]
  )
  React.useEffect(() => {
    setSelectedOption(
      iconColorSelectOptionList.find(option => option.value === value) ||
        iconColorSelectOptionList[0]
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  return (
    <StyledFlex>
      <TextWrapper justifyContent='center' alignItems='center'>
        <Text style={{ fontSize: isMobile ? '14px' : '11px' }}>
          {selectorLabel}
        </Text>
      </TextWrapper>
      <DropdownWrapper isMobile={isMobile}>
        <Dropdown
          flex={1}
          options={iconColorSelectOptionList}
          value={selectedOption}
          onChange={(option: DropdownColorOptionType) => {
            setSelectedOption(option)
            onChange(option)
          }}
        />
      </DropdownWrapper>
    </StyledFlex>
  )
}

export const ColorSelector = React.memo<ColorSelectorProps>(Selector)
