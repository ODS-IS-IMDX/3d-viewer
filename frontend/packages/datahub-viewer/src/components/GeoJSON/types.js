// Copyright (c) 2025 NTT InfraNet
// @flow
// https://cesium.com/docs/cesiumjs-ref-doc/LabelGraphics.html?classFilter=label#.ConstructorOptions
export type LabelProperty = {
  text?: string
}

export type PointIconType =
  | 'building'
  | 'caution'
  | 'chain'
  | 'constructionWorker'
  | 'drone'
  | 'flag'
  | 'measure'
  | 'pin'
  | 'pinWhite'
  | 'plusCircle'
  | 'record'
  | 'triangularCone'
  | 'truck'
  | 'ts'
  | 'circle'
  | 'none'
export type IconProperty = {
  type: PointIconType,
  options?: { color: string }
}

export type Coordinates = [number, number, number]
export type GeoJSONGeometry = {
  type: string,
  coordinates: Array<Coordinates>
}
export type GeoJSONFeature = {
  id: string,
  name: string,
  type: string,
  geometry: GeoJSONGeometry,
  properties: {
    color?: string,
    label?: LabelProperty,
    icon?: IconProperty,
    zIndex?: number
  }
}

export type GeoJSONFeatures = Array<GeoJSONFeature>
