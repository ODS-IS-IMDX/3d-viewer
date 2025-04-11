// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import { Box, Text, Dropdown } from '@ehv/datahub-components'
import { EXTENSION, UNKNOWN_ZIP } from 'plugins/file/constants'
import type { TFunction } from 'react-i18next'

type ExtensionSelectProps = {
  fileType: string,
  fileExtensionList: Array<string>,
  setFileType: (fileType: string) => void,
  t: TFunction
}

const Component = (props: ExtensionSelectProps) => {
  const { fileType, fileExtensionList, setFileType, t } = props
  const allOptions = fileExtensionList.map(forEachExtension =>
    forEachExtension === EXTENSION.ZIP
      ? {
          label: forEachExtension,
          value: UNKNOWN_ZIP
        }
      : {
          label: forEachExtension,
          value: forEachExtension
        }
  )
  !fileType &&
    allOptions.splice(0, 0, {
      label: t('fileRegisterModal.optionLabel.extensionDefault'),
      value: ''
    })

  const selectedOption =
    fileExtensionList.length === 1
      ? allOptions[0]
      : allOptions.find(option => option.value === fileType)

  return (
    <Box width='100%'>
      <Text ml={2} mt={2} mb={1} fontSize={2}>
        {t('fileRegisterModal.selectLabel.extension')}
      </Text>
      <Dropdown
        mb={5}
        options={allOptions}
        value={selectedOption}
        onChange={selectOption => setFileType(selectOption.value)}
      />
    </Box>
  )
}
export const ExtensionSelect = React.memo<ExtensionSelectProps>(Component)
