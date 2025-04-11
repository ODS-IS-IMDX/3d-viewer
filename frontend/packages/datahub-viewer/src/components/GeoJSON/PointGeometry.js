// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import { CLUSTER_DATASOURCE_NAME, ViewerContext, Entity } from 'react-cesium'
import { Color, VerticalOrigin } from 'cesium'

import {
  convertCoordinatesToPointPosition,
  generateBillboardProperty,
  isPointValid
} from './utils'
import type { GeoJSONFeature } from './types'

type PointProps = {
  feature: GeoJSONFeature
}

export const labelDefaults = {
  font: '16px "Source Sans Pro"',
  fillColor: Color.WHITE,
  verticalOrigin: VerticalOrigin.TOP
}

export const PointGeometry = React.forwardRef<PointProps, {}>((props, ref) => {
  const {
    feature: {
      id,
      geometry: { coordinates } = {},
      properties: {
        zIndex = 0,
        label = {},
        icon = {},
        billboardProperties = {}
      } = {}
    }
  } = props

  if (!isPointValid(coordinates)) {
    return null
  }

  return (
    <ViewerContext.Consumer>
      {viewer => (
        <Entity
          ref={ref}
          id={id}
          position={convertCoordinatesToPointPosition(coordinates)}
          billboard={{
            ...generateBillboardProperty(icon, zIndex),
            ...billboardProperties
          }}
          label={{
            ...labelDefaults,
            ...(label.color
              ? { ...label, fillColor: Color.fromCssColorString(label.color) }
              : label),
            ...(label.textFontSize
              ? { ...label, font: `${label.textFontSize}px "Source Sans Pro"` }
              : label)
          }}
          clusterDataSourceName={CLUSTER_DATASOURCE_NAME.ANNOTATION_POINT}
          viewer={viewer}
        />
      )}
    </ViewerContext.Consumer>
  )
})

export default React.memo<PointProps>(PointGeometry)
