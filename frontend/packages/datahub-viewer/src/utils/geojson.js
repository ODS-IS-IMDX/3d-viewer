// Copyright (c) 2025 NTT InfraNet
// @flow
import turfArea from '@turf/area'
import turfBbox from '@turf/bbox'
import { feature as turfFeature, point as turfPoint } from '@turf/helpers'
import { isEmpty } from 'lodash'

export type ForeignMembers = {
  id: string,
  name?: string
}

export type AnnotationType = 'arrow' | 'line' | 'polygon' | 'point' | 'label'

export function featureCollection (id, features) {
  return {
    id,
    features,
    type: 'FeatureCollection'
  }
}

export function lineString (
  coordinates,
  foreignMembers: ForeignMembers,
  properties
) {
  return {
    ...foreignMembers,
    ...turfFeature({ type: 'LineString', coordinates }, properties)
  }
}

export function polygon (id, points, properties) {
  return {
    id,
    type: 'Feature',
    properties: {
      ...properties
    },
    geometry: {
      type: 'Polygon',
      coordinates: [isEmpty(points) ? [] : [...points, points[0]]]
    }
  }
}

export function point (
  coordinates,
  foreignMembers: ForeignMembers,
  properties
) {
  if (!Array.isArray(coordinates)) {
    return {}
  }

  if (coordinates.length === 0) {
    return {}
  }

  return {
    ...foreignMembers, // id is implemented as geojson foreign members https://tools.ietf.org/html/rfc7946#section-6.1
    ...turfPoint(coordinates, properties)
  }
}

export function writeProperties (feature = { properties: {} }, newProperties) {
  return {
    ...feature,
    properties: {
      ...feature.properties,
      ...newProperties
    }
  }
}

export function emptyFeature (
  id: number,
  annotationType: AnnotationType,
  properties
) {
  switch (annotationType) {
    case 'arrow':
      return lineString(
        [],
        { id },
        { ...properties, annotationType, isArrow: true }
      ) // color not respected by cesium for arrows
    case 'line':
      return lineString(
        [],
        { id },
        { ...properties, annotationType, isArrow: false }
      )
    case 'polygon':
      return {
        id,
        type: 'Feature',
        properties: {
          ...properties,
          annotationType,
          opacity: 0.5
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[]]
        }
      }
    case 'point':
      return point(
        [],
        { id },
        {
          ...properties,
          annotationType,
          type: 'marker',
          text: id,
          isActive: true,
          markerSymbol: 'pin'
        }
      )
    case 'label':
      return point(
        [],
        { id },
        {
          ...properties,
          type: 'label',
          text: id,
          isActive: true,
          annotationType
        }
      )
    default:
      return {}
  }
}

export const trimId = coordinates => coordinates.slice(0, 3) // trim geojson coordinate id from end of array

// takes a polygon, a turfjs grid constructor, and a target number of samples
// returns the passed grid with the target number of samples
export const samplePolygon = (polygon, grid, target = 200) => {
  const surfaceArea = turfArea(polygon)
  const cellArea = surfaceArea / target // target specified number of samples
  const cellSideMeters = Math.sqrt(cellArea)
  const boundingBox = turfBbox(polygon)
  return grid(boundingBox, cellSideMeters / 1000, { mask: polygon })
}

export const getColorBySpeed = speed => {
  let color = '#ff3333'
  if (speed === null || (speed >= 0 && speed < 5)) {
    color = '#ff3333'
  } else if (speed >= 5 && speed < 10) {
    color = '#ff6633'
  } else if (speed >= 10 && speed < 15) {
    color = '#ff9933'
  } else if (speed >= 15 && speed < 20) {
    color = '#ffcc33'
  } else if (speed >= 20 && speed < 25) {
    color = '#ffff33'
  } else if (speed >= 25 && speed < 30) {
    color = '#33ff33'
  } else if (speed >= 30 && speed < 35) {
    color = '#33ffcc'
  } else if (speed >= 35 && speed < 40) {
    color = '#33ccff'
  } else if (speed >= 40 && speed < 45) {
    color = '#3399ff'
  } else if (speed >= 45 && speed < 50) {
    color = '#0066ff'
  } else if (speed >= 50) {
    color = '#ec22d3'
  }
  return color
}
