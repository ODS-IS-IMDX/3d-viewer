// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import { Box, Text, Dropdown } from '@ehv/datahub-components'

type IsSpaceSelectProps = {
  isSpace: boolean,
  setIsSpace: (isSpace: boolean) => void
}
const IsSpaceSelectComponent = (props: IsSpaceSelectProps) => {
  const { isSpace, setIsSpace } = props

  const options = [
    {
      label: '空間ID化しない',
      value: false
    },
    { label: '空間ID化する', value: true }
  ]
  return (
    <Box width='100%'>
      <Text ml={2} mt={2} mb={1} fontSize={2}>
        空間ID化の選択
      </Text>
      <Dropdown
        mb={5}
        options={options}
        value={options.find(option => option.value === isSpace)}
        onChange={selectOption => setIsSpace(selectOption.value)}
      />
    </Box>
  )
}
export const IsSpaceSelect = React.memo<IsSpaceSelectProps>(
  IsSpaceSelectComponent
)
