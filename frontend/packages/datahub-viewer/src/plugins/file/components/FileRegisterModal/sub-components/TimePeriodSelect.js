// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import { Flex, Box, Text } from '@ehv/datahub-components'
import DateTimePicker from 'components/DateTimePicker'

import type { TFunction } from 'react-i18next'

type TimePeriodSelectProps = {
  fromValue: Date | null,
  toValue: Date | null,
  fromOnChange: (value: String) => void,
  toOnChange: (value: String) => void,
  t: TFunction
}
const Select = (props: TimePeriodSelectProps) => {
  const { fromValue, toValue, fromOnChange, toOnChange, t } = props

  return (
    <Box width='100%' mt={5}>
      <Text ml={2} mt={2} mb={1} fontSize={2}>
        {t('fileRegisterModal.selectLabel.timePeriod')}
      </Text>
      <Flex>
        <DateTimePicker
          value={fromValue || undefined}
          onChange={fromOnChange}
        />
        <Text
          size={4}
          p={2}
          alignItems='center'
          fontWeight='bold'
          color='#3a4248'
        >
          &#65374;
        </Text>
        <DateTimePicker value={toValue || undefined} onChange={toOnChange} />
      </Flex>
    </Box>
  )
}

export const TimePeriodSelect = React.memo<TimePeriodSelectProps>(Select)
