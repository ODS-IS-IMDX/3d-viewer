// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { useEffect } from 'react'
import { Box, Dropdown, Link, Text } from '@ehv/datahub-components'
import { CATEGORY, FORMAT_TYPE, FORMAT_TYPE_NAME } from 'plugins/file/constants'

import type { TFunction } from 'react-i18next'
import type { UploadFile } from 'plugins/file/reducer'

type FormatTypeSelectProps = {
  file: UploadFile | null,
  formatType: string,
  category: string,
  displayFormatTypeList: Array<string>,
  isFormatTypeAvailable: boolean,
  setFormatType: (formatType: string) => void,
  setProjectionAvailable: (isProjectionAvailable: boolean) => void,
  setVerticalProjectionAvailable: (
    isVerticalProjectionAvailable: boolean
  ) => void,
  setIsTerrain: (isTerrain: boolean) => void,
  t: TFunction
}

const FormatTypeSelectComponent = (props: FormatTypeSelectProps) => {
  const {
    file,
    formatType,
    category,
    displayFormatTypeList,
    isFormatTypeAvailable,
    setFormatType,
    setProjectionAvailable,
    setVerticalProjectionAvailable,
    setIsTerrain,
    t
  } = props
  const allOptions = [
    { label: t('fileRegisterModal.optionLabel.formatTypeDefault'), value: '' },
    { label: FORMAT_TYPE_NAME.LASER, value: FORMAT_TYPE.LASER },
    { label: FORMAT_TYPE_NAME.LANDXML, value: FORMAT_TYPE.LANDXML },
    { label: FORMAT_TYPE_NAME.DXF, value: FORMAT_TYPE.DXF },
    { label: FORMAT_TYPE_NAME.FILMBOX, value: FORMAT_TYPE.FILMBOX },
    { label: FORMAT_TYPE_NAME.IFC, value: FORMAT_TYPE.IFC },
    { label: FORMAT_TYPE_NAME.DWG, value: FORMAT_TYPE.DWG },
    { label: FORMAT_TYPE_NAME.CITYGML, value: FORMAT_TYPE.CITYGML },
    { label: FORMAT_TYPE_NAME.KML, value: FORMAT_TYPE.KML },
    { label: FORMAT_TYPE_NAME.SHAPE, value: FORMAT_TYPE.SHAPE },
    { label: FORMAT_TYPE_NAME.GEOTIFF, value: FORMAT_TYPE.GEOTIFF },
    { label: FORMAT_TYPE_NAME.TIFF, value: FORMAT_TYPE.TIFF },
    { label: FORMAT_TYPE_NAME.JPEG, value: FORMAT_TYPE.JPEG },
    { label: FORMAT_TYPE_NAME.CZML, value: FORMAT_TYPE.CZML },
    { label: FORMAT_TYPE_NAME.GEOJSON, value: FORMAT_TYPE.GEOJSON },
    { label: FORMAT_TYPE_NAME.TILES3D, value: FORMAT_TYPE.TILES3D },
    { label: FORMAT_TYPE_NAME.GLTF, value: FORMAT_TYPE.GLTF }
  ]
  const displayOptions = []
  displayFormatTypeList.forEach(displayFormatType => {
    allOptions.forEach(option => {
      option.value === displayFormatType && displayOptions.push(option)
    })
  })
  const selectedOption =
    displayOptions.length === 1
      ? displayOptions[0]
      : displayOptions.find(option => option.value === formatType) ||
        allOptions[0]

  useEffect(() => {
    displayOptions.length === 1 && setFormatType(selectedOption.value)
    if (formatType === FORMAT_TYPE.GLTF) {
      // グローバル座標を持つgltfファイルの場合、座標系を選択させ
      setProjectionAvailable(
        !!(
          file &&
          file.closedInfo &&
          Array.isArray(file.closedInfo.rootNodeTranslation)
        )
      )
    } else {
      setProjectionAvailable(
        [
          FORMAT_TYPE.LASER,
          FORMAT_TYPE.LANDXML,
          FORMAT_TYPE.DXF,
          FORMAT_TYPE.FILMBOX,
          FORMAT_TYPE.IFC,
          FORMAT_TYPE.DWG,
          FORMAT_TYPE.KML,
          FORMAT_TYPE.JPEG,
          FORMAT_TYPE.TIFF,
          FORMAT_TYPE.GEOTIFF
        ].includes(selectedOption.value)
      )
    }
    setVerticalProjectionAvailable(
      [
        FORMAT_TYPE.LASER,
        FORMAT_TYPE.LANDXML,
        FORMAT_TYPE.DXF,
        FORMAT_TYPE.KML,
        FORMAT_TYPE.JPEG,
        FORMAT_TYPE.TIFF,
        FORMAT_TYPE.GEOTIFF
      ].includes(selectedOption.value) &&
        !(
          [FORMAT_TYPE.TIFF, FORMAT_TYPE.GEOTIFF].includes(
            selectedOption.value
          ) && category === CATEGORY.TOPOGRAPHY
        ) &&
        !(
          FORMAT_TYPE.GEOTIFF === selectedOption.value &&
          category === CATEGORY.IMAGERY
        )
    )
    setIsTerrain(
      [FORMAT_TYPE.TIFF, FORMAT_TYPE.GEOTIFF].includes(selectedOption.value) &&
        category === CATEGORY.TOPOGRAPHY
    )
    !isFormatTypeAvailable && setFormatType('')
  }, [
    category,
    displayOptions.length,
    file,
    formatType,
    isFormatTypeAvailable,
    selectedOption.value,
    setFormatType,
    setIsTerrain,
    setProjectionAvailable,
    setVerticalProjectionAvailable
  ])

  if (!isFormatTypeAvailable) {
    return null
  }

  return (
    <Box width='100%'>
      <Text ml={2} mt={2} mb={1} fontSize={2}>
        {t('fileRegisterModal.selectLabel.formatType')}
      </Text>
      {formatType === FORMAT_TYPE.SHAPE && (
        <Text ml={2} mt={2} mb={1} fontSize={0}>
          {t('fileRegisterModal.selectLabel.formatTypeTooltip.prefix')}
          <Link
            onClick={() => {
              setProjectionAvailable(true)
              setVerticalProjectionAvailable(true)
            }}
          >
            {t('fileRegisterModal.selectLabel.formatTypeTooltip.linkText')}
          </Link>
          {t('fileRegisterModal.selectLabel.formatTypeTooltip.suffix')}
        </Text>
      )}
      <Dropdown
        mb={5}
        options={displayOptions}
        value={selectedOption}
        onChange={selectOption => setFormatType(selectOption.value)}
      />
    </Box>
  )
}

export const FormatTypeSelect = React.memo<FormatTypeSelectProps>(
  FormatTypeSelectComponent
)
