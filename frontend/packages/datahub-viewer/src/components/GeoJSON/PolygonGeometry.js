// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import { ShadowMode } from 'cesium'
import { Entity, ViewerContext } from 'react-cesium'
import type { GeoJSONFeature } from '@mapbox/geojson-types'

import {
  convertCoordinatesToCartesian3,
  convertCssColorToCesiumColor
} from 'utils/cesium'

type PolygonGeometryProps = {
  feature: GeoJSONFeature
}

const polygonDefaults = {
  shadow: ShadowMode.DISABLED
}

export const PolygonGeometry = (props: PolygonGeometryProps) => {
  const {
    feature: {
      id,
      geometry: { coordinates = [[]] } = {},
      properties,
      properties: {
        color = 'cyan',
        outLine = false,
        outLineColor = 'black',
        opacity = 0.5
      } = {}
    } = {}
  } = props
  if (coordinates.length < 3) {
    return null
  }

  const hierarchy = coordinates.map(([lon, lat, height]) =>
    convertCoordinatesToCartesian3(lon, lat, height)
  )
  const material = convertCssColorToCesiumColor(color, opacity)
  const outLineColorMaterial = convertCssColorToCesiumColor(outLineColor, 1)

  return (
    <ViewerContext.Consumer>
      {viewer => (
        <Entity
          id={id}
          polygon={{
            ...polygonDefaults,
            ...properties,
            hierarchy,
            material: material,
            outLine: outLine,
            outLineColor: outLineColorMaterial
          }}
          viewer={viewer}
        />
      )}
    </ViewerContext.Consumer>
  )
}

PolygonGeometry.defaultProps = {
  feature: {
    id: '',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [[]]
    }
  }
}

export default React.memo<PolygonGeometryProps>(PolygonGeometry)
