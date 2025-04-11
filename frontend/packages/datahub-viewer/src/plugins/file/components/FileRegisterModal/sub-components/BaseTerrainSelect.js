// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import { Box, Text, Dropdown } from '@ehv/datahub-components'
import {
  BASE_TERRAIN_CWT_ID,
  BASE_TERRAIN_GIS_ID
} from 'plugins/file/constants'
import type { TFunction } from 'react-i18next'

type BaseTerrainSelectProps = {
  baseTerrainList: any,
  baseTerrainId?: any,
  setBaseTerrainId: (baseTerrainId: string) => void,
  t: TFunction
}

const BaseTerrainSelectComponent = (props: BaseTerrainSelectProps) => {
  const { baseTerrainList, baseTerrainId, setBaseTerrainId, t } = props
  const _baseTerrainList =
    baseTerrainList && baseTerrainList.length > 0 ? baseTerrainList : []
  const displayOptions = [
    !BASE_TERRAIN_GIS_ID && {
      label: t('fileRegisterModal.optionLabel.baseTerrainDefault'),
      value: BASE_TERRAIN_GIS_ID
    },
    {
      label: t('fileRegisterModal.optionLabel.baseTerrainCWT'),
      value: BASE_TERRAIN_CWT_ID
    },
    ..._baseTerrainList.map(
      item =>
        item.ionAssetId && {
          label: item.name,
          value: item.ionAssetId
        }
    )
  ]
  const selectedOption =
    displayOptions.length === 2
      ? displayOptions[0]
      : displayOptions.find(option => option.value === baseTerrainId)

  return (
    <Box width='100%'>
      <Text ml={2} mt={2} mb={1} fontSize={2}>
        {t('fileRegisterModal.selectLabel.baseTerrain')}
      </Text>
      <Dropdown
        mb={5}
        options={displayOptions}
        value={selectedOption}
        onChange={selectOption => setBaseTerrainId(selectOption.value)}
      />
    </Box>
  )
}

export const BaseTerrainSelect = React.memo<BaseTerrainSelectProps>(
  BaseTerrainSelectComponent
)
