// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { withNamespaces, type WithNamespaces } from 'react-i18next'
import { Dropdown, Flex } from '@ehv/datahub-components'
import { CameraEventType } from 'cesium'
import { ErrorMessage } from './ErrorMessage'
import usePrevious from './usePrevious'

// styles

const TabPanelBox = styled(Flex)`
  flex-direction: column;
  padding: 10px;
`
const DropdownWrapper = styled(Dropdown)`
  margin-top: 10px;
`

// types

export type MouseCameraSettingsMenuProps = WithNamespaces & {
  initialValue: {
    horizontal: string,
    rotate: string,
    zoom: string
  },
  errors?: any,
  /** formik.setFieldValue */
  setFieldValue: (
    fieldName: string,
    value: any,
    shouldValidate?: boolean
  ) => void
}
type DropdownOption = {
  label: string,
  value: string // JSON配列
}

// components

/**
 * マウス設定メニュー
 */
const MouseCameraSettingsMenu = ({
  t,
  initialValue,
  errors = {},
  setFieldValue
}: MouseCameraSettingsMenuProps) => {
  const prevInitialValue = usePrevious(initialValue)
  // カメライベント一覧
  const [cameraEventOptions, setCameraEventOptions] = useState([])
  const prevCameraEventOptions = usePrevious(cameraEventOptions)
  // 水平移動
  const [horizontal, setHorizontal] = useState(cameraEventOptions[0])
  // 回転
  const [rotate, setRotate] = useState(cameraEventOptions[2])
  // ズーム
  const [zoom, setZoom] = useState(cameraEventOptions[3])

  useEffect(() => {
    setCameraEventOptions([
      {
        label: t('cameraConfig.mouse.cameraEvents.leftDrag'),
        value: JSON.stringify([CameraEventType.LEFT_DRAG])
      },
      {
        label: t('cameraConfig.mouse.cameraEvents.rightDrag'),
        value: JSON.stringify([CameraEventType.RIGHT_DRAG])
      },
      {
        label: t('cameraConfig.mouse.cameraEvents.middleDrag'),
        value: JSON.stringify([CameraEventType.MIDDLE_DRAG])
      },
      {
        label: t('cameraConfig.mouse.cameraEvents.wheel'),
        value: JSON.stringify([CameraEventType.WHEEL, CameraEventType.PINCH])
      }
    ])
  }, [t])

  useEffect(() => {
    if (
      JSON.stringify(initialValue) !== JSON.stringify(prevInitialValue) ||
      JSON.stringify(cameraEventOptions) !==
        JSON.stringify(prevCameraEventOptions)
    ) {
      setHorizontal(
        cameraEventOptions.find(
          option => option.value === initialValue.horizontal
        ) ?? cameraEventOptions[0]
      )
      setRotate(
        cameraEventOptions.find(
          option => option.value === initialValue.rotate
        ) ?? cameraEventOptions[2]
      )
      setZoom(
        cameraEventOptions.find(option => option.value === initialValue.zoom) ??
          cameraEventOptions[3]
      )
    }
  }, [
    initialValue,
    prevInitialValue,
    cameraEventOptions,
    prevCameraEventOptions
  ])

  return (
    <TabPanelBox>
      {/** 水平移動 */}
      <DropdownWrapper
        isDisabled // 3DモードではLEFT_DRAG固定なので、変更は非活性にする
        label={t('cameraConfig.mouse.horizontal')}
        name={'horizontal'}
        title={t('cameraConfig.mouse.tooltip.horizontal')}
        options={cameraEventOptions}
        value={horizontal}
        onChange={(option: DropdownOption) => {
          setHorizontal(option)
          setFieldValue('horizontal', option.value)
        }}
      />
      {errors.horizontal != null && (
        <ErrorMessage>{errors.horizontal}</ErrorMessage>
      )}
      {/** 回転 */}
      <DropdownWrapper
        label={t('cameraConfig.mouse.rotate')}
        name={'rotate'}
        options={cameraEventOptions.slice(1)}
        value={rotate}
        onChange={(option: DropdownOption) => {
          setRotate(option)
          setFieldValue('rotate', option.value)
        }}
      />
      {errors.rotate != null && <ErrorMessage>{errors.rotate}</ErrorMessage>}
      {/** ズーム */}
      <DropdownWrapper
        label={t('cameraConfig.mouse.zoom')}
        name={'zoom'}
        options={cameraEventOptions.slice(1)}
        value={zoom}
        onChange={(option: DropdownOption) => {
          setZoom(option)
          setFieldValue('zoom', option.value)
        }}
      />
      {errors.zoom != null && <ErrorMessage>{errors.zoom}</ErrorMessage>}
    </TabPanelBox>
  )
}

export default withNamespaces('site')(MouseCameraSettingsMenu)
