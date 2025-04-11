// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import { Box, Text, DropdownWithInput } from '@ehv/datahub-components'

import type { TFunction } from 'react-i18next'

export const allOptions = [
  { label: '', value: null },
  { label: 'EPSG:5773 / EGM96 height', value: 5773 },
  {
    label: 'EPSG:6695 / JGD2011 height (gsigeo2011_ver2_1 geoid)',
    value: 6695
  },
  {
    label: 'EPSG:6694 / JGD2000 height (gsigeo2011_ver2_1 geoid)',
    value: 6694
  }
]

type VerticalProjectionSelectProps = {
  verticalProjection: number | null,
  setVerticalProjection: (verticalProjection: number | null) => void,
  t: TFunction
}
const Component = (props: VerticalProjectionSelectProps) => {
  const { verticalProjection, setVerticalProjection, t } = props

  allOptions[0].label = t(
    'fileRegisterModal.optionLabel.verticalProjectionDefault'
  )

  const isWrongVerticalProjection =
    verticalProjection !== null &&
    (isNaN(verticalProjection) ||
      verticalProjection < 1024 ||
      verticalProjection > 32767)

  return (
    <Box width='100%'>
      <Text ml={2} mt={2} mb={1} fontSize={2}>
        <span>{t('fileRegisterModal.selectLabel.verticalProjection')}</span>
        {isWrongVerticalProjection && (
          <span style={{ color: 'red' }}>
            {t('fileRegisterModal.selectLabel.projectionWarning')}
          </span>
        )}
      </Text>
      <DropdownWithInput
        mb={5}
        options={allOptions}
        value={
          allOptions.find(option => option.value === verticalProjection) || {
            label: verticalProjection ? verticalProjection + '' : '',
            value: verticalProjection
          }
        }
        onChange={inputValue => {
          const selectedOption = allOptions.find(
            option => option.label === inputValue
          )
          const inputVerticalProjection = isNaN(inputValue)
            ? selectedOption
              ? selectedOption.value
              : 0
            : parseInt(inputValue)
          setVerticalProjection(inputVerticalProjection)
        }}
      />
    </Box>
  )
}
export const VerticalProjectionSelect = React.memo<VerticalProjectionSelectProps>(
  Component
)
