// Copyright (c) 2025 NTT InfraNet
import React from 'react'
import { Cesium3DTileset as Base3DTileset, IonResource } from 'cesium'

import CesiumAsyncComponent from '../CesiumAsyncComponent'
import PrimitivesContext from '../PrimitivesContext'
import Cesium3DTilesetContext from '../Cesium3DTilesetContext'

export class Cesium3DTileset extends React.PureComponent {
  constructor (props) {
    super(props)
    this.mount = this.mount.bind(this)
    this.create = this.create.bind(this)
    this.unmount = this.unmount.bind(this)
    this.children = this.children.bind(this)
  }

  async create () {
    try {
      const url = await IonResource.fromAssetId(this.props.assetId)
      const ret = await Base3DTileset.fromUrl(url, this.props)
      if (this.props.onReady) {
        this.props.onReady(ret)
      }
      return ret
    } catch (e) {
      if (this.props.onLoadFailed) {
        this.props.onLoadFailed(e)
      }
      throw e
    }
  }

  mount (element) {
    this.props.primitives.add(element)
  }

  unmount (element) {
    if (!this.props.primitives.isDestroyed()) {
      this.props.primitives.remove(element)
    }
  }

  children (element) {
    return (
      <Cesium3DTilesetContext.Provider value={element}>
        {typeof this.props.children === 'function'
          ? this.props.children(element)
          : this.props.children}
      </Cesium3DTilesetContext.Provider>
    )
  }

  render () {
    return (
      <CesiumAsyncComponent
        {...this.props}
        ref={this.props._ref}
        mount={this.mount}
        create={this.create}
        unmount={this.unmount}
        children={this.children}
        cesiumProps={this.constructor.cesiumProps}
        cesiumEvents={this.constructor.cesiumEvents}
        cesiumReadOnlyProps={this.constructor.cesiumReadOnlyProps}
      />
    )
  }
}

Cesium3DTileset.cesiumProps = [
  'assetId',
  'backFaceCulling',
  'baseScreenSpaceError',
  'clippingPlanes',
  'colorBlendAmount',
  'colorBlendMode',
  'debugColorizeTiles',
  'debugFreezeFrame',
  'debugShowBoundingVolume',
  'debugShowContentBoundingVolume',
  'debugShowGeometricError',
  'debugShowMemoryUsage',
  'debugShowRenderingStatistics',
  'debugShowUrl',
  'debugShowViewerRequestVolume',
  'debugWireframe',
  'dynamicScreenSpaceError',
  'dynamicScreenSpaceErrorDensity',
  'dynamicScreenSpaceErrorFactor',
  'dynamicScreenSpaceErrorHeightFalloff',
  'imageBasedLighting',
  'immediatelyLoadDesiredLevelOfDetail',
  'lightColor',
  'loadSiblings',
  'maximumMemoryUsage',
  'maximumScreenSpaceError',
  'modelMatrix',
  'pointCloudShading',
  'shadows',
  'show',
  'skipLevelOfDetail',
  'skipLevels',
  'skipScreenSpaceErrorFactor',
  'style'
]

Cesium3DTileset.cesiumEvents = [
  'allTilesLoaded',
  'initialTilesLoaded',
  'loadProgress',
  'tileFailed',
  'tileLoad',
  'tileUnload',
  'tileVisible'
]

Cesium3DTileset.cesiumReadOnlyProps = [
  'asset',
  'basePath',
  'boundingSphere',
  'classificationType',
  'cullWithChildrenBounds',
  'customShader',
  'ellipsoid',
  'properties',
  'ready',
  'readyPromise',
  'tilesLoaded',
  'timeSinceLoad',
  'totalMemoryUsageInBytes',
  'url'
]

export const Cesium3DTilesetContainer = React.forwardRef((props, ref) => (
  <PrimitivesContext.Consumer>
    {primitives => (
      <Cesium3DTileset {...props} _ref={ref} primitives={primitives} />
    )}
  </PrimitivesContext.Consumer>
))
