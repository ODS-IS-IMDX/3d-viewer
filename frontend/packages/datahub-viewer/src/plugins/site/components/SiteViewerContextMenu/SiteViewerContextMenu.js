// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import type { WithNamespaces } from 'react-i18next'
import { Text, ContextMenu } from '@ehv/datahub-components'

export type SiteViewerContextMenuProps = WithNamespaces & {
  unit: string,
  mapviewName: string,
  renderQualityName: string,
  mapType: string,
  openMapTypeModal: () => {},
  openRenderQualityModal: () => {},
  openMapviewModal: () => {},
  openLightControllerMenu: () => void,
  openGlobeContourMenu: () => {},
  openBaseTerrainSelectorMenu: () => {},
  openCameraControlModal: () => void
}

export const SiteViewerContextMenu = ({
  t,
  unit,
  ...props
}: SiteViewerContextMenuProps) => (
  <ContextMenu {...props}>
    <ContextMenu.Item
      onClick={props.openMapviewModal}
      label={t('mapview.label')}
    >
      <Text size={1} lineHeight='1.36' fontWeight='bold'>
        &nbsp;{t(`mapview.${props.mapviewName}`)}
      </Text>
    </ContextMenu.Item>
    <ContextMenu.Item
      label={t('mapMore.baseTerrain')}
      onClick={props.openBaseTerrainSelectorMenu}
      variant='normal'
    >
      <></>
    </ContextMenu.Item>
    <ContextMenu.Item
      onClick={props.openMapTypeModal}
      label={t('mapMore.baseMap')}
    >
      <Text size={1} lineHeight='1.36' fontWeight='bold'>
        &nbsp;{t(`mapMore.${props.mapType}`)}
      </Text>
    </ContextMenu.Item>
    <ContextMenu.Item label={t('mapMore.units')}>
      <Text size={1} lineHeight='1.36' fontWeight='bold'>
        &nbsp;{t(`common:units.${unit}`)}
      </Text>
    </ContextMenu.Item>
    <ContextMenu.Item
      onClick={props.openRenderQualityModal}
      label={t('renderQuality.label')}
    >
      <Text size={1} lineHeight='1.36' fontWeight='bold'>
        &nbsp;{t(`renderQuality.${props.renderQualityName}`)}
      </Text>
    </ContextMenu.Item>
    <ContextMenu.Item
      onClick={props.openGlobeTranslucencyMenu}
      label={t('globeTranslucency.label')}
    />
    <ContextMenu.Item
      label={t('globeContour.label')}
      onClick={props.openGlobeContourMenu}
      variant='normal'
    >
      <></>
    </ContextMenu.Item>
    <ContextMenu.Item
      label={t('lightController.label')}
      onClick={props.openLightControllerMenu}
      variant='normal'
    >
      <></>
    </ContextMenu.Item>
    <ContextMenu.Item
      label={t('cameraConfig.label')}
      onClick={props.openCameraControlModal}
      variant='normal'
    >
      <></>
    </ContextMenu.Item>
  </ContextMenu>
)

export default SiteViewerContextMenu
