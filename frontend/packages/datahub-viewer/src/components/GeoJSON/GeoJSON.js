// Copyright (c) 2025 NTT InfraNet
// @flow
import GeoJSONFactory, { Geometry } from 'components/GeoJSONFactory'
import PointGeometry from './PointGeometry'
import LineStringGeometry from './LineStringGeometry'
import PolygonGeometry from './PolygonGeometry'

const geometriesMap = {
  [Geometry.POINT]: PointGeometry,
  [Geometry.LINE_STRING]: LineStringGeometry,
  [Geometry.POLYGON]: PolygonGeometry
}

export default GeoJSONFactory(geometriesMap)
