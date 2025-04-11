// Copyright (c) 2025 NTT InfraNet
import React from 'react'
import { ImageryLayer as CesiumImageryLayer } from 'cesium'

import CesiumComponent from '../CesiumComponent'
import ImageryLayerContext from '../ImageryLayerContext'
import ImageryLayersContext from '../ImageryLayersContext'

class ImageryLayer extends React.Component {
  constructor (props) {
    super(props)
    this.mount = this.mount.bind(this)
    this.create = this.create.bind(this)
    this.unmount = this.unmount.bind(this)
    this.children = this.children.bind(this)
  }

  create () {
    const { imageryProvider, ...options } = this.props
    return new CesiumImageryLayer(imageryProvider, options)
  }

  mount (layer) {
    const { index } = this.props
    if (this.props.imageryLayers) {
      this.props.imageryLayers.add(layer, index)
    }
  }

  unmount (layer) {
    if (this.props.imageryLayers) {
      this.props.imageryLayers.remove(layer, true)
    }
  }

  children (layer) {
    return (
      <ImageryLayerContext.Provider value={layer}>
        {typeof this.props.children === 'function'
          ? this.props.children(layer)
          : this.props.children}
      </ImageryLayerContext.Provider>
    )
  }

  shouldComponentUpdate (nextProps) {
    return (
      this.props.imageryProvider._accessToken !==
        nextProps.imageryProvider._accessToken ||
      (this.props.imageryProvider._resource &&
        this.props.imageryProvider._resource._url !==
          nextProps.imageryProvider._resource._url) ||
      this.props.alpha !== nextProps.alpha
    )
  }

  render () {
    return (
      <CesiumComponent
        {...this.props}
        ref={this.props._ref}
        mount={this.mount}
        create={this.create}
        unmount={this.unmount}
        children={this.children}
        cesiumProps={this.constructor.cesiumProps}
        cesiumEvents={this.constructor.cesiumEvents}
        cesiumReadOnlyProps={[
          ...this.props.cesiumReadOnlyProps,
          ...this.constructor.cesiumReadOnlyProps
        ]}
      />
    )
  }
}

ImageryLayer.cesiumProps = [
  'alpha',
  'brightness',
  'colorToAlpha',
  'colorToAlphaThreshold',
  'contrast',
  'cutoutRectangle',
  'gamma',
  'hue',
  'ionAssetId',
  'magnificationFilter',
  'minificationFilter',
  'saturation',
  'show',
  'splitDirection'
]

ImageryLayer.cesiumEvents = []
ImageryLayer.cesiumReadOnlyProps = [
  'DEFAULT_APPLY_COLOR_TO_ALPHA_THRESHOLD',
  'DEFAULT_BRIGHTNESS',
  'DEFAULT_CONTRAST',
  'DEFAULT_GAMMA',
  'DEFAULT_HUE',
  'DEFAULT_MAGNIFICATION_FILTER',
  'DEFAULT_MINIFICATION_FILTER',
  'DEFAULT_SATURATION',
  'DEFAULT_SPLIT',
  'imageryProvider',
  'readonlyrectangle'
]

ImageryLayer.defaultProps = {
  cesiumReadOnlyProps: []
}

export const ImageryLayerContainer = React.forwardRef((props, ref) => (
  <ImageryLayersContext.Consumer>
    {imageryLayers => {
      return (
        <ImageryLayer {...props} _ref={ref} imageryLayers={imageryLayers} />
      )
    }}
  </ImageryLayersContext.Consumer>
))
