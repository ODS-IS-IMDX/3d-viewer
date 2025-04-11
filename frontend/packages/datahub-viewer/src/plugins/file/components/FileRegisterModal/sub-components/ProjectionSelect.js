// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import { Box, Text, DropdownWithInput } from '@ehv/datahub-components'

import type { TFunction } from 'react-i18next'

export const allOptions = [
  { label: '', value: null },
  {
    label: 'EPSG:4326 / WGS84 / World Geodetic System 1984, used in GPS',
    value: 4326
  },
  { label: 'EPSG:6669 / JGD2011 / Japan Plane Rectangular CS I', value: 6669 },
  { label: 'EPSG:6670 / JGD2011 / Japan Plane Rectangular CS II', value: 6670 },
  {
    label: 'EPSG:6671 / JGD2011 / Japan Plane Rectangular CS III',
    value: 6671
  },
  { label: 'EPSG:6672 / JGD2011 / Japan Plane Rectangular CS IV', value: 6672 },
  { label: 'EPSG:6673 / JGD2011 / Japan Plane Rectangular CS V', value: 6673 },
  { label: 'EPSG:6674 / JGD2011 / Japan Plane Rectangular CS VI', value: 6674 },
  {
    label: 'EPSG:6675 / JGD2011 / Japan Plane Rectangular CS VII',
    value: 6675
  },
  {
    label: 'EPSG:6676 / JGD2011 / Japan Plane Rectangular CS VIII',
    value: 6676
  },
  { label: 'EPSG:6677 / JGD2011 / Japan Plane Rectangular CS IX', value: 6677 },
  { label: 'EPSG:6678 / JGD2011 / Japan Plane Rectangular CS X', value: 6678 },
  { label: 'EPSG:6679 / JGD2011 / Japan Plane Rectangular CS XI', value: 6679 },
  {
    label: 'EPSG:6680 / JGD2011 / Japan Plane Rectangular CS XII',
    value: 6680
  },
  {
    label: 'EPSG:6681 / JGD2011 / Japan Plane Rectangular CS XIII',
    value: 6681
  },
  {
    label: 'EPSG:6682 / JGD2011 / Japan Plane Rectangular CS XIV',
    value: 6682
  },
  { label: 'EPSG:6683 / JGD2011 / Japan Plane Rectangular CS XV', value: 6683 },
  {
    label: 'EPSG:6684 / JGD2011 / Japan Plane Rectangular CS XVI',
    value: 6684
  },
  {
    label: 'EPSG:6685 / JGD2011 / Japan Plane Rectangular CS XVII',
    value: 6685
  },
  {
    label: 'EPSG:6686 / JGD2011 / Japan Plane Rectangular CS XVIII',
    value: 6686
  },
  {
    label: 'EPSG:6687 / JGD2011 / Japan Plane Rectangular CS XIX',
    value: 6687
  },
  { label: 'EPSG:6688 / JGD2011 / UTM zone 51N', value: 6688 },
  { label: 'EPSG:6689 / JGD2011 / UTM zone 52N', value: 6689 },
  { label: 'EPSG:6690 / JGD2011 / UTM zone 53N', value: 6690 },
  { label: 'EPSG:6691 / JGD2011 / UTM zone 54N', value: 6691 },
  { label: 'EPSG:6692 / JGD2011 / UTM zone 55N', value: 6692 },
  { label: 'EPSG:2443 / JGD2000 / Japan Plane Rectangular CS I', value: 2443 },
  { label: 'EPSG:2444 / JGD2000 / Japan Plane Rectangular CS II', value: 2444 },
  {
    label: 'EPSG:2445 / JGD2000 / Japan Plane Rectangular CS III',
    value: 2445
  },
  { label: 'EPSG:2446 / JGD2000 / Japan Plane Rectangular CS IV', value: 2446 },
  { label: 'EPSG:2447 / JGD2000 / Japan Plane Rectangular CS V', value: 2447 },
  { label: 'EPSG:2448 / JGD2000 / Japan Plane Rectangular CS VI', value: 2448 },
  {
    label: 'EPSG:2449 / JGD2000 / Japan Plane Rectangular CS VII',
    value: 2449
  },
  {
    label: 'EPSG:2450 / JGD2000 / Japan Plane Rectangular CS VIII',
    value: 2450
  },
  { label: 'EPSG:2451 / JGD2000 / Japan Plane Rectangular CS IX', value: 2451 },
  { label: 'EPSG:2452 / JGD2000 / Japan Plane Rectangular CS X', value: 2452 },
  { label: 'EPSG:2453 / JGD2000 / Japan Plane Rectangular CS XI', value: 2453 },
  {
    label: 'EPSG:2454 / JGD2000 / Japan Plane Rectangular CS XII',
    value: 2454
  },
  {
    label: 'EPSG:2455 / JGD2000 / Japan Plane Rectangular CS XIII',
    value: 2455
  },
  {
    label: 'EPSG:2456 / JGD2000 / Japan Plane Rectangular CS XIV',
    value: 2456
  },
  { label: 'EPSG:2457 / JGD2000 / Japan Plane Rectangular CS XV', value: 2457 },
  {
    label: 'EPSG:2458 / JGD2000 / Japan Plane Rectangular CS XVI',
    value: 2458
  },
  {
    label: 'EPSG:2459 / JGD2000 / Japan Plane Rectangular CS XVII',
    value: 2459
  },
  {
    label: 'EPSG:2460 / JGD2000 / Japan Plane Rectangular CS XVIII',
    value: 2460
  },
  {
    label: 'EPSG:2461 / JGD2000 / Japan Plane Rectangular CS XIX',
    value: 2461
  },
  { label: 'EPSG:3097 / JGD2000 / UTM zone 51N', value: 3097 },
  { label: 'EPSG:3098 / JGD2000 / UTM zone 52N', value: 3098 },
  { label: 'EPSG:3099 / JGD2000 / UTM zone 53N', value: 3099 },
  { label: 'EPSG:3100 / JGD2000 / UTM zone 54N', value: 3100 },
  { label: 'EPSG:3101 / JGD2000 / UTM zone 55N', value: 3101 },
  { label: 'EPSG:32651 / WGS84 / UTM zone 51N', value: 32651 },
  { label: 'EPSG:32652 / WGS84 / UTM zone 52N', value: 32652 },
  { label: 'EPSG:32653 / WGS84 / UTM zone 53N', value: 32653 },
  { label: 'EPSG:32654 / WGS84 / UTM zone 54N', value: 32654 },
  { label: 'EPSG:32655 / WGS84 / UTM zone 55N', value: 32655 }
]

type ProjectionSelectProps = {
  isProjectionAvailable: boolean,
  projection: number | null,
  setProjection: (projection: number | null) => void,
  setVerticalProjection: (verticalProjection: number | null) => void,
  t: TFunction
}

const ProjectionSelectComponent = (props: ProjectionSelectProps) => {
  const {
    isProjectionAvailable,
    projection,
    setProjection,
    setVerticalProjection,
    t
  } = props

  if (!isProjectionAvailable) {
    return null
  }

  allOptions[0].label = t('fileRegisterModal.optionLabel.projectionDefault')

  const isWrongProjection =
    projection !== null &&
    (isNaN(projection) || projection < 1024 || projection > 32767)

  return (
    <Box width='100%'>
      <Text ml={2} mt={2} mb={1} fontSize={2}>
        <span>{t('fileRegisterModal.selectLabel.projection')}</span>
        {isWrongProjection && (
          <span style={{ color: 'red' }}>
            {t('fileRegisterModal.selectLabel.projectionWarning')}
          </span>
        )}
      </Text>
      <DropdownWithInput
        mb={5}
        options={allOptions}
        value={
          allOptions.find(option => option.value === projection) || {
            label: projection + '',
            value: projection
          }
        }
        onChange={inputValue => {
          const selectedOption = allOptions.find(
            option => option.label === inputValue
          )
          const inputProjection = isNaN(inputValue)
            ? selectedOption
              ? selectedOption.value
              : 0
            : parseInt(inputValue)
          setProjection(inputProjection)
          // WGS84の場合は標準標高を指定するとエラーとなるため空にする
          if (inputProjection === null || inputProjection === 4326) {
            setVerticalProjection(null)
          }
        }}
      />
    </Box>
  )
}
export const ProjectionSelect = React.memo<ProjectionSelectProps>(
  ProjectionSelectComponent
)
