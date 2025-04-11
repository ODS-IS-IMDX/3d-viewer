// Copyright (c) 2025 NTT InfraNet
import React from 'react'
import {
  Viewer as CesiumViewer,
  PinBuilder,
  Color,
  CustomDataSource,
  VerticalOrigin,
  HeightReference
} from 'cesium'

import CesiumComponent from '../CesiumComponent'
import ViewerContext from '../ViewerContext'
import { CLUSTER_DATASOURCE_NAME } from '../Entity'

export class Viewer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.ref = null
    this.onRef = this.onRef.bind(this)
    this.create = this.create.bind(this)
    this.unmount = this.unmount.bind(this)
    this.children = this.children.bind(this)
  }

  onRef (element) {
    if (!element) {
      this.viewer = undefined
      this.ref = undefined
      return
    }
    this.ref = element

    this.viewer = new CesiumViewer(this.ref, this.props)
    if (this.props._ref) {
      if (typeof this.props._ref === 'function') {
        this.props._ref(this.viewer)
      } else {
        this.props._ref.current = this.viewer
      }
    }

    this.forceUpdate()
  }

  create () {
    const pinBuilder = new PinBuilder()
    const singleDigitPins = {
      ANNOTATION_POINT: new Array(18),
      BLACKBOARD: new Array(18),
      VIDEO: new Array(18)
    }
    for (let i = 0; i < 18; ++i) {
      if (i < 8) {
        singleDigitPins.ANNOTATION_POINT[i] = pinBuilder
          .fromText('' + (i + 2), Color.GREEN, 50 + i * 10)
          .toDataURL()
        singleDigitPins.BLACKBOARD[i] = pinBuilder
          .fromText('' + (i + 2), Color.ORANGE, 50 + i * 10)
          .toDataURL()
        singleDigitPins.VIDEO[i] = pinBuilder
          .fromText('' + (i + 2), Color.SKYBLUE, 50 + i * 10)
          .toDataURL()
      } else {
        singleDigitPins.ANNOTATION_POINT[i] = pinBuilder
          .fromText('' + (i - 7) * 10 + '+', Color.GREEN, 50 + i * 10)
          .toDataURL()
        singleDigitPins.BLACKBOARD[i] = pinBuilder
          .fromText('' + (i - 7) * 10 + '+', Color.ORANGE, 50 + i * 10)
          .toDataURL()
        singleDigitPins.VIDEO[i] = pinBuilder
          .fromText('' + (i - 7) * 10 + '+', Color.SKYBLUE, 50 + i * 10)
          .toDataURL()
      }
    }
    // Viewerがインスタンスする時に、クラスタ表示用EntityCollectionを生成する
    Object.values(CLUSTER_DATASOURCE_NAME).forEach(groupName =>
      this.viewer.dataSources
        .add(new CustomDataSource(groupName))
        .then(dataSource => {
          dataSource.clustering.enabled = true
          dataSource.clustering.pixelRange = 15
          dataSource.clustering.minimumClusterSize = 2
          dataSource.clustering.clusterEvent.addEventListener(
            (clusteredEntities, cluster) => {
              cluster.label.show = false
              cluster.billboard.show = true
              cluster.billboard.id = cluster.label.id
              cluster.billboard.verticalOrigin = VerticalOrigin.BOTTOM
              cluster.billboard.heightReference =
                HeightReference.CLAMP_TO_GROUND
              const clusteredEntitiesCount = clusteredEntities.length
              if (clusteredEntitiesCount < 10) {
                cluster.billboard.image =
                  singleDigitPins[groupName][clusteredEntitiesCount - 2]
              } else {
                cluster.billboard.image =
                  // eslint-disable-next-line
                  singleDigitPins[groupName][
                    Math.floor(clusteredEntitiesCount / 10) + 7
                  ]
              }
            }
          )
        })
    )
    return this.viewer
  }

  unmount (element) {
    element.destroy()
  }

  children (element) {
    return (
      <ViewerContext.Provider value={element}>
        {typeof this.props.children === 'function'
          ? this.props.children(element)
          : this.props.children}
      </ViewerContext.Provider>
    )
  }

  render () {
    return (
      <div ref={this.onRef} style={this.props.style}>
        {this.ref && (
          <CesiumComponent
            {...this.props}
            mount={this.mount}
            create={this.create}
            unmount={this.unmount}
            children={this.children}
            cesiumProps={this.constructor.cesiumProps}
            cesiumEvents={this.constructor.cesiumEvents}
            cesiumReadOnlyProps={this.constructor.cesiumReadOnlyProps}
          />
        )}
      </div>
    )
  }
}

Viewer.cesiumProps = [
  'allowDataSourcesToSuspendAnimation',
  'clockTrackedDataSource',
  'resolutionScale',
  'sceneMode',
  'scene3DOnly',
  'selectedEntity',
  'shadows',
  'scene',
  'selectionIndicator',
  'targetFrameRate',
  'terrainProvider',
  'requestRenderMode',
  'terrainShadows',
  'trackedEntity',
  'useDefaultRenderLoop'
]

Viewer.cesiumEvents = ['selectedEntityChanged', 'trackedEntityChanged']

Viewer.cesiumReadOnlyProps = [
  'animation',
  'automaticallyTrackDataSourceClocks',
  'baseLayerPicker',
  'bottomContainer',
  'camera',
  'canvas',
  'cesiumWidget',
  'clock',
  'clockViewModel',
  'container',
  'contextOptions',
  'creditContainer',
  'creditViewport',
  'dataSourceDisplay',
  'dataSources',
  'entities',
  'fullscreenButton',
  'fullscreenElement',
  'geocoder',
  'globe',
  'homeButton',
  'imageryLayers',
  'imageryProvider',
  'imageryProviderViewModels',
  'infoBox',
  'mapMode2D',
  'mapProjection',
  'maximumRenderTimeChange',
  'navigationHelpButton',
  'navigationInstructionsInitiallyVisible',
  'orderIndependentTranslucency',
  'postProcessStages',
  'projectionPicker',
  'sceneModePicker',
  'screenSpaceEventHandler',
  'selectedImageryProviderViewModel',
  'selectedTerrainProviderViewModel',
  'shadowMap',
  'shouldAnimate',
  'showRenderLoopErrors',
  'skyAtmosphere',
  'skyBox',
  'terrainExaggeration',
  'terrainProviderViewModels',
  'timeline',
  'vrButton',
  'useBrowserRecommendedResolution'
]

export const ViewerContainer = React.forwardRef((props, ref) => (
  <Viewer {...props} _ref={ref} />
))
