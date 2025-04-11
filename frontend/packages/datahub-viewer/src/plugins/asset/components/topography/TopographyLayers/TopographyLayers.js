// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { memo } from 'react'
import i18n from 'i18n'

import { Matrix4, PointCloudShading } from 'cesium'
import { Cesium3DTileset } from '../../../../../react-cesium'
import { modelFrameToEastNorthUp } from 'utils/cesium'
import type { AssetID, Topography } from '../../../reducer'

type TopographyLayersProps = {
  topographyList: Array<Topography>,
  viewer: any,
  notifyError: (message: string, name: string) => void,
  setTopographyVisibility: (id: AssetID, isVisible: boolean) => void,
  setAssetRenderingState: (id: AssetID, isRendering: boolean) => void,
  setAssetAvailable: (id: AssetID, isAvailable: boolean) => void,
  notifyTopographyRenderingCompleted: (id: AssetID) => void
}

const TopographyLayerBase = memo(props => {
  const {
    id,
    assetName,
    ionAssetId,
    customPosition,
    viewer,
    notifyError,
    setTopographyVisibility,
    setAssetRenderingState,
    setAssetAvailable,
    notifyTopographyRenderingCompleted
  } = props
  const pointCloudShading = new PointCloudShading({
    attenuation: PointCloudShading.isSupported(viewer.scene),
    maximumAttenuation: 1
  })
  const onReady = tileset => {
    const { transform } = customPosition || {}
    if (transform) {
      modelFrameToEastNorthUp(tileset)
      Matrix4.clone(Matrix4.fromArray(transform), tileset.modelMatrix)
    }
    notifyTopographyRenderingCompleted(id)
    setTopographyVisibility(id, true)
  }
  const onLoadFailed = () => {
    setTopographyVisibility(id, false)
    setAssetRenderingState(id, false)
    setAssetAvailable(id, false)
    notifyError(
      i18n.t('asset:common.notification.notGetAssetErrorMessage', { assetName })
    )
  }

  return (
    <Cesium3DTileset
      assetId={ionAssetId}
      pointCloudShading={pointCloudShading}
      onReady={onReady}
      backFaceCulling
      onLoadFailed={onLoadFailed}
    />
  )
})

const TopographyLayers = (props: TopographyLayersProps) => {
  const {
    topographyList,
    viewer,
    notifyError,
    setTopographyVisibility,
    setAssetRenderingState,
    setAssetAvailable,
    notifyTopographyRenderingCompleted
  } = props

  if (!viewer) return null

  return (
    <>
      {topographyList.map(topography => (
        <TopographyLayerBase
          key={topography.id}
          id={topography.id}
          assetName={topography.name}
          ionAssetId={topography.ionAssetId}
          customPosition={topography.customPosition}
          viewer={viewer}
          notifyError={notifyError}
          setTopographyVisibility={setTopographyVisibility}
          setAssetRenderingState={setAssetRenderingState}
          setAssetAvailable={setAssetAvailable}
          notifyTopographyRenderingCompleted={
            notifyTopographyRenderingCompleted
          }
        />
      ))}
    </>
  )
}

export default TopographyLayers
