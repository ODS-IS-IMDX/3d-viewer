// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import { Text, FormInput } from '@ehv/datahub-components'

import type { TFunction } from 'react-i18next'

type CellSpacingInputProps = {
  cellSpacing: string,
  setCellSpacing: (cellSpacing: string) => void,
  t: TFunction
}

const CellSpacingInputComponent = (props: CellSpacingInputProps) => {
  const { cellSpacing, setCellSpacing, t } = props

  return (
    <>
      <Text ml={2} mt={2} mb={1} fontSize={2}>
        {t('fileRegisterModal.cellSpacingInput.label')}
      </Text>
      <FormInput
        defaultValue={cellSpacing}
        onBlur={event => setCellSpacing(event.target.value)}
      />
    </>
  )
}
export const CellSpacingInput = React.memo<CellSpacingInputProps>(
  CellSpacingInputComponent
)
