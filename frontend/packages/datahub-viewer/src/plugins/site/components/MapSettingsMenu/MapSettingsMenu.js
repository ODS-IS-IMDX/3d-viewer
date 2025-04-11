// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import { ContextMenu } from '@ehv/datahub-components'
import styled from 'styled-components'
import BaseTerrainSelectorMenu from '../BaseTerrainSelectorMenu'
import GlobeTranslucencyMenu from '../GlobeTranslucencyMenu'
import GlobeContourMenu from '../GlobeContourMenu'
import LightControllerMenu from '../LightControllerMenu'
import MapTypeSetting from '../MapTypeSetting'
import MapviewModal from '../MapviewModal'
import RenderQualityModal from '../RenderQualityModal'
import type { UserProfile } from 'addons/auth/reducers'

export type MapSettingsMenuProps = {
  mapView: string,
  onChangeMapView: (mapView: string) => void,
  baseTerrain: number | null,
  baseTerrainList: any,
  onChangeBaseTerrain: (baseTerrain: number, baseTerrainName: string) => void,
  mapType: string,
  onChangeMapType: (mapType: string) => void,
  renderQuality: string,
  onChangeRenderQuality: (renderQuality: string) => void,
  isFadeByDistance: boolean,
  onChangeFadeByDistance: (isFadeByDistance: boolean) => void,
  alphaValue: number,
  onChangeAlphaData: (alphaValue: number) => void,
  isEnableContour: boolean,
  onChangeEnableContour: (isEnableContour: boolean) => void,
  spacing: number,
  onChangeSpacing: (spacing: number) => void,
  color: string,
  onChangeColor: (color: string) => void,
  isHiddenBelowTerrain: boolean,
  onChangeIsHiddenBelowTerrain: (isHiddenBelowTerrain: boolean) => void,
  isMobile: boolean,
  userProfile: UserProfile
}

const MapSettingsContextMenu = styled(ContextMenu)`
  width: ${props => (props.isMobile ? '100%' : '385px')};
  ${props => props.isMobile && 'height: 100%'};
  & > div {
    width: ${props => (props.isMobile ? '100%' : '385px')};
    height: ${props => (props.isMobile ? 'calc(100% - 60px)' : '580px')};
    padding: 20px 0;
    cursor: default;
    border-radius: 0px;
    background-color: rgba(255, 255, 255, 0.95);

    & > * {
      flex-shrink: 0;
    }
  }
`
const MapSettingsDivider = styled(ContextMenu.Divider)`
  margin: 12px 16px;
  border-top: solid 1px #c4c4c4;
`

export const MapSettingsMenu = ({ ...props }: MapSettingsMenuProps) => {
  const {
    mapView,
    onChangeMapView,
    baseTerrain,
    baseTerrainList,
    onChangeBaseTerrain,
    mapType,
    onChangeMapType,
    renderQuality,
    onChangeRenderQuality,
    isFadeByDistance,
    onChangeFadeByDistance,
    alphaValue,
    onChangeAlphaData,
    isEnableContour,
    onChangeEnableContour,
    spacing,
    onChangeSpacing,
    color,
    onChangeColor,
    isHiddenBelowTerrain,
    onChangeIsHiddenBelowTerrain,
    isMobile,
    userProfile,
    ...otherProps
  } = props

  return (
    <MapSettingsContextMenu {...otherProps} isMobile={isMobile}>
      <MapviewModal
        onChange={onChangeMapView}
        userProfile={userProfile}
        value={mapView}
      />
      {mapView !== 'real3D' && (
        <>
          <BaseTerrainSelectorMenu
            value={baseTerrain}
            baseTerrainList={baseTerrainList}
            onChange={onChangeBaseTerrain}
          />
          <MapSettingsDivider />
          <MapTypeSetting onChange={onChangeMapType} value={mapType} />
          <MapSettingsDivider />
        </>
      )}
      <RenderQualityModal
        onChange={onChangeRenderQuality}
        value={renderQuality}
      />
      <MapSettingsDivider />
      {mapView !== 'real3D' && (
        <>
          <GlobeTranslucencyMenu
            isFadeByDistance={isFadeByDistance}
            onChangeFadeByDistance={onChangeFadeByDistance}
            alphaValue={alphaValue}
            setAlphaData={onChangeAlphaData}
            isHiddenBelowTerrain={isHiddenBelowTerrain}
            onChangeIsHiddenBelowTerrain={onChangeIsHiddenBelowTerrain}
          />
          <MapSettingsDivider />
          <GlobeContourMenu
            isEnableContour={isEnableContour}
            onChangeEnableContour={onChangeEnableContour}
            spacing={spacing}
            onChangeSpacing={onChangeSpacing}
            color={color}
            onChangeColor={onChangeColor}
          />
          <MapSettingsDivider />
          <LightControllerMenu />
        </>
      )}
    </MapSettingsContextMenu>
  )
}

export default MapSettingsMenu
