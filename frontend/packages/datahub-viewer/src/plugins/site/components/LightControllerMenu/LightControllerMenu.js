// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { memo, useCallback, useEffect, useState } from 'react'
import { Checkbox, Flex, Switch, Text } from '@ehv/datahub-components'
import DateTimePicker from 'components/DateTimePicker'
import MapSettingsMenuItem from '../MapSettingsMenuItem/MapSettingsMenuItem'
import { convertDateToJulian } from 'utils/cesium'

import type { WithNamespaces } from 'react-i18next'
import type { ShadowOptions } from 'plugins/site/types'

type LightControllerMenuProps = WithNamespaces & {
  viewer: any,
  shadowOptions: ShadowOptions,
  setShadowOptions: (shadowOptions: ShadowOptions) => void
}

const Menu = ({
  viewer,
  shadowOptions,
  setShadowOptions,
  t
}: LightControllerMenuProps) => {
  const {
    /** 影の有効 */
    isShadow: isEnableShadows,
    /** エンティティの影の有効 */
    isEntityShadow: isEnableEntityShadows,
    /** 地形の影の有効 */
    isTerrainShadow: isEnableTerrainShadows,
    /** 日付時間 */
    datetime
  } = shadowOptions
  /** 影の表示設定 */
  const onChangeEnableShadows = (enable: boolean) =>
    setShadowOptions({ isShadow: enable })
  /** アセットの影の表示設定 */
  const onChangeEntityShadows = (enable: boolean) =>
    setShadowOptions({ isEntityShadow: enable })
  /** 地形の影の表示設定 */
  const onChangeTerrainShadows = (enable: boolean) =>
    setShadowOptions({ isTerrainShadow: enable })

  const [enable, setEnable] = useState(isEnableShadows)
  const [enableEntity, setEnableEntity] = useState(isEnableEntityShadows)
  const [enableTerrain, setEnableTerrain] = useState(isEnableTerrainShadows)
  const [lightControllerDateTime, setLightControllerDateTime] = useState(
    datetime || new Date()
  )

  /** Viewerの時間を設定し再レンダリング */
  const setCesiumDateTime = useCallback(
    (datetime: Date) => {
      if (enable && (enableEntity || enableTerrain)) {
        viewer.clock.currentTime = convertDateToJulian(datetime)
        viewer.scene.requestRenderMode && viewer.scene.requestRender()
      }
    },
    [viewer, enable, enableEntity, enableTerrain]
  )

  useEffect(() => {
    setCesiumDateTime(lightControllerDateTime)
  }, [lightControllerDateTime, setCesiumDateTime])

  return (
    <>
      {/** 日照設定 */}
      <MapSettingsMenuItem variant='normal' justifyContent='space-between'>
        <Text fontWeight={600}>{t('lightController.show')}</Text>
        <Flex style={{ margin: '0 100px 0 0' }}>
          <Switch
            checked={enable}
            onChange={event => {
              const checked = event.target.checked
              setEnable(checked)
              onChangeEnableShadows(checked)
            }}
          />
        </Flex>
      </MapSettingsMenuItem>
      <Flex>
        {/** アセットの影 */}
        <MapSettingsMenuItem flex={'50%'} alignItems='center'>
          <Checkbox
            checked={enableEntity}
            onChange={event => {
              const checked = event.target.checked
              setEnableEntity(checked)
              onChangeEntityShadows(checked)
            }}
          />
          <Text
            fontSize={14}
            fontWeight={400}
            lineHeight={1.36}
            style={{ margin: '0 0 0 20px' }}
          >
            {t('lightController.entity')}
          </Text>
        </MapSettingsMenuItem>
        {/** 地形の影 */}
        <MapSettingsMenuItem flex={'50%'} alignItems='center'>
          <Checkbox
            checked={enableTerrain}
            onChange={event => {
              const checked = event.target.checked
              setEnableTerrain(checked)
              onChangeTerrainShadows(checked)
            }}
          />
          <Text
            fontSize={14}
            fontWeight={400}
            lineHeight={1.36}
            style={{ margin: '0 0 0 20px' }}
          >
            {t('lightController.terrain')}
          </Text>
        </MapSettingsMenuItem>
      </Flex>
      {/* 日付入力 */}
      <Flex>
        <MapSettingsMenuItem alignItems='center'>
          <Text
            fontSize={14}
            fontWeight={400}
            lineHeight={1.36}
            style={{ margin: '0 20px 0 0' }}
          >
            {t('lightController.datetime')}
          </Text>
          <DateTimePicker
            value={lightControllerDateTime}
            onChange={value => {
              setShadowOptions({ datetime: value })
              setLightControllerDateTime(value)
              setCesiumDateTime(value)
            }}
            pickerPosition={{ bottom: '40px' }}
          />
        </MapSettingsMenuItem>
      </Flex>
    </>
  )
}

export const LightControllerMenu = memo<LightControllerMenuProps>(Menu)
export default LightControllerMenu
