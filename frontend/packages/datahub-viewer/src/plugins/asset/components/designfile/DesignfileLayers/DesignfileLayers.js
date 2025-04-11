// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { memo } from 'react'
import i18n from 'i18n'

import { Matrix4 } from 'cesium'
import { Cesium3DTileset, PrimitivesContext } from '../../../../../react-cesium'
import { modelFrameToEastNorthUp } from 'utils/cesium'
import type { AssetID, Designfile } from '../../../reducer'

type DesignfileLayersProps = {
  designfileList: Array<Designfile>,
  viewer: any,
  notifyError: (message: string, name: string) => void,
  setDesignfileVisibility: (id: AssetID, isVisible: boolean) => void,
  setAssetRenderingState: (id: AssetID, isRendering: boolean) => void,
  setAssetAvailable: (id: AssetID, isAvailable: boolean) => void,
  notifyDesignfileRenderingCompleted: (id: AssetID) => void
}
type Designfile3DTileLayerBaseProps = {
  id?: AssetID,
  ionAssetId?: number,
  notifyError: (message: string, name: string) => void,
  setDesignfileVisibility: (id: AssetID, isVisible: boolean) => void,
  setAssetRenderingState: (id: AssetID, isRendering: boolean) => void,
  setAssetAvailable: (id: AssetID, isAvailable: boolean) => void,
  notifyDesignfileRenderingCompleted: (id: AssetID) => void
}
const Designfile3DTileLayerBase = memo<Designfile3DTileLayerBaseProps>(
  props => {
    const {
      id,
      assetName,
      ionAssetId,
      customPosition,
      notifyError,
      setDesignfileVisibility,
      setAssetRenderingState,
      setAssetAvailable,
      notifyDesignfileRenderingCompleted
    } = props
    const onReady = tileset => {
      const { transform } = customPosition || {}
      if (transform) {
        modelFrameToEastNorthUp(tileset)
        Matrix4.clone(Matrix4.fromArray(transform), tileset.modelMatrix)
      }
      notifyDesignfileRenderingCompleted(id)
      setDesignfileVisibility(id, true)
    }
    const onLoadFailed = () => {
      setDesignfileVisibility(id, false)
      setAssetRenderingState(id, false)
      setAssetAvailable(id, false)
      notifyError(
        i18n.t('asset:common.notification.notGetAssetErrorMessage', {
          assetName
        })
      )
    }
    return (
      <Cesium3DTileset
        assetId={ionAssetId}
        onReady={onReady}
        backFaceCulling
        onLoadFailed={onLoadFailed}
      />
    )
  }
)

const DesignfileLayers = (props: DesignfileLayersProps) => {
  const {
    designfileList,
    viewer,
    notifyError,
    setDesignfileVisibility,
    setAssetRenderingState,
    setAssetAvailable,
    notifyDesignfileRenderingCompleted
  } = props

  if (!viewer) return null

  return (
    <>
      {designfileList.map(designfile => {
        return (
          <PrimitivesContext.Consumer key={designfile.ionAssetId}>
            {primitives => (
              <Designfile3DTileLayerBase
                key={designfile.id}
                id={designfile.id}
                assetName={designfile.name}
                ionAssetId={designfile.ionAssetId}
                customPosition={designfile.customPosition}
                notifyError={notifyError}
                setDesignfileVisibility={setDesignfileVisibility}
                setAssetRenderingState={setAssetRenderingState}
                setAssetAvailable={setAssetAvailable}
                notifyDesignfileRenderingCompleted={
                  notifyDesignfileRenderingCompleted
                }
              />
            )}
          </PrimitivesContext.Consumer>
        )
      })}
    </>
  )
}
export default DesignfileLayers
