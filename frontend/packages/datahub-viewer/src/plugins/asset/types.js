// Copyright (c) 2025 NTT InfraNet
// @flow
export type AssetType = 'designFile' | 'topography'
export const AssetTypes = {
  DESIGNFILE: 'designFile',
  TOPOGRAPHY: 'topography'
}
export type FormatTypeName = 'LASer' | 'CityGML'
export type FormatTypeValue = 'laser' | 'citygml'
export type FormatType = {
  LASER: { NAME: FormatTypeName, VALUE: FormatTypeValue },
  CITYGML: { NAME: FormatTypeName, VALUE: FormatTypeValue }
}

export type CesiumIonTypes =
  | '3DTILES'
  | 'GLTF'
  | 'IMAGERY'
  | 'TERRAIN'
  | 'KML'
  | 'CZML'
  | 'GEOJSON'

export type Coordinate = [?number, ?number, ?number]
export type Coordinates = Array<Coordinate>
