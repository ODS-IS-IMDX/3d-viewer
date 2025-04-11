// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { useEffect } from 'react'
import { Box, Text, Dropdown } from '@ehv/datahub-components'
import { CATEGORY } from 'plugins/file/constants'

import type { TFunction } from 'react-i18next'

type CategorySelectProps = {
  category: string,
  displayCategoryList: Array<string>,
  isCategoryAvailable: boolean,
  setCategory: (category: string) => void,
  t: TFunction
}

const CategorySelectComponent = (props: CategorySelectProps) => {
  const {
    category,
    displayCategoryList,
    isCategoryAvailable,
    setCategory,
    t
  } = props
  const allOptions = [
    { label: t('fileRegisterModal.optionLabel.categoryDefault'), value: '' },
    {
      label: t('fileRegisterModal.optionLabel.topography'),
      value: CATEGORY.TOPOGRAPHY
    },
    {
      label: t('fileRegisterModal.optionLabel.imagery'),
      value: CATEGORY.IMAGERY
    },
    {
      label: t('fileRegisterModal.optionLabel.model3d'),
      value: CATEGORY.MODEL_3D
    },
    {
      label: t('fileRegisterModal.optionLabel.designFile'),
      value: CATEGORY.DESIGN_FILE
    },
    {
      label: t('fileRegisterModal.optionLabel.overlay'),
      value: CATEGORY.OVERLAY
    },
    {
      label: t('fileRegisterModal.optionLabel.picture'),
      value: CATEGORY.PICTURE
    },
    { label: t('fileRegisterModal.optionLabel.video'), value: CATEGORY.VIDEO }
  ]
  const displayOptions = []
  displayCategoryList.forEach(displayCategory => {
    allOptions.forEach(option => {
      option.value === displayCategory && displayOptions.push(option)
    })
  })

  const selectedOption =
    displayOptions.length === 1
      ? displayOptions[0]
      : displayOptions.find(option => option.value === category) ||
        allOptions[0]

  useEffect(() => {
    displayOptions.length === 1 && setCategory(selectedOption.value)
  })

  if (!isCategoryAvailable) {
    return null
  }

  return (
    <Box width='100%'>
      <Text ml={2} mt={2} mb={1} fontSize={2}>
        {t('fileRegisterModal.selectLabel.category')}
      </Text>
      <Dropdown
        mb={5}
        options={displayOptions}
        value={selectedOption}
        onChange={selectOption => setCategory(selectOption.value)}
      />
    </Box>
  )
}
export const CategorySelect = React.memo<CategorySelectProps>(
  CategorySelectComponent
)
