// Copyright (c) 2025 NTT InfraNet
import React from 'react'

import CesiumComponent from '../CesiumComponent'
import ImageryLayerContext from '../ImageryLayerContext'
import ImageryLayersContext from '../ImageryLayersContext'

// 'abstract' component
export class ImageryProvider extends React.PureComponent {
  constructor (props) {
    super(props)
    this.mount = this.mount.bind(this)
    this.unmount = this.unmount.bind(this)
    this.children = this.children.bind(this)
  }

  mount (provider) {
    return this.props.imageryLayers.addImageryProvider(provider)
  }

  unmount (provider, mounted) {
    this.props.imageryLayers.remove(mounted, true)
  }

  children (provider, layer) {
    if (layer) {
      return (
        <ImageryLayerContext.Provider value={layer}>
          {typeof this.props.children === 'function'
            ? this.props.children(provider, layer)
            : this.props.children}
        </ImageryLayerContext.Provider>
      )
    } else {
      return null
    }
  }

  render () {
    return (
      <CesiumComponent
        {...this.props}
        ref={this.props._ref}
        mount={this.mount}
        unmount={this.unmount}
        children={this.children}
        cesiumProps={[
          ...this.props.cesiumProps,
          ...this.constructor.cesiumProps
        ]}
        cesiumEvents={[
          ...this.props.cesiumEvents,
          ...this.constructor.cesiumEvents
        ]}
        cesiumReadOnlyProps={this.props.cesiumReadOnlyProps}
      />
    )
  }
}

ImageryProvider.defaultProps = {
  cesiumProps: [],
  cesiumEvents: [],
  cesiumReadOnlyProps: []
}

ImageryProvider.cesiumProps = [
  'defaultAlpha',
  'defaultBrightness',
  'defaultContrast',
  'defaultGamma',
  'defaultHue',
  'defaultMagnificationFilter',
  'defaultMinificationFilter',
  'defaultSaturation'
]

ImageryProvider.cesiumEvents = ['errorEvent']

export const ImageryProviderContainer = React.forwardRef((props, ref) => (
  <ImageryLayersContext.Consumer>
    {imageryLayers => (
      <ImageryProvider {...props} _ref={ref} imageryLayers={imageryLayers} />
    )}
  </ImageryLayersContext.Consumer>
))
