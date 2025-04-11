// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import { GroundPolylineGeometry, ViewerContext } from 'react-cesium'
import { Cartesian3, Material } from 'cesium'
import type { GeoJSONFeature } from '@mapbox/geojson-types'

import { convertCssColorToCesiumColor } from 'utils/cesium'

const DetailsType = {
  ARROW: 'Arrow'
}

type LineStringGeometryProps = {
  feature: GeoJSONFeature
}

export const LineStringGeometry = (props: LineStringGeometryProps) => {
  const {
    feature: {
      id,
      geometry: { coordinates = [], detailsType } = {},
      properties: { color = 'cyan', opacity = 1 } = {}
    } = {}
  } = props

  if (coordinates.length < 2) {
    return null
  }

  return (
    <ViewerContext.Consumer>
      {viewer => (
        <GroundPolylineGeometry
          id={id}
          material={
            detailsType === DetailsType.ARROW
              ? Material.fromType(Material.PolylineArrowType, {
                  color: convertCssColorToCesiumColor(color, opacity)
                })
              : Material.fromType(Material.ColorType, {
                  color: convertCssColorToCesiumColor(color, opacity)
                })
          }
          positions={Cartesian3.fromDegreesArrayHeights(coordinates.flat())}
          width={detailsType === DetailsType.ARROW ? 20 : 5}
          viewer={viewer}
        />
      )}
    </ViewerContext.Consumer>
  )
}

LineStringGeometry.defaultProps = {
  feature: {
    id: '',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: []
    }
  }
}

export default React.memo<LineStringGeometryProps>(LineStringGeometry)
