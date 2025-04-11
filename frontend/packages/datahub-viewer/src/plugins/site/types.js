// Copyright (c) 2025 NTT InfraNet
// @flow
export type MeasurementUnit = {
  distance?: string,
  area?: string,
  volume?: string
}
export type SelectedItemData = {
  id: string,
  name: string,
  node: any,
  isDirectory: boolean,
  isOrigin: boolean,
  enableDelete: boolean
}

export type ShadowOptions = {
  isShadow?: boolean,
  isEntityShadow?: boolean,
  isTerrainShadow?: boolean,
  datetime?: Date
}

/** 等高線表示設定 */
export type MaterialContourOptions = {
  /** 表示 */
  enable: boolean,
  /** 等高線間隔 */
  spacing: number,
  /** 等高線色(#FFFFFF) */
  color: string
}

/** 地図マウス操作設定 */
export type MapControlMouseType = {
  horizontal: Array<string>,
  rotate: Array<string>,
  zoom: Array<string>
}

/** 地図キーボード操作設定 */
export type MapControlKeyType = {
  zoomIn: string,
  zoomOut: string,
  moveUp: string,
  moveDown: string,
  moveFoward: string,
  moveBackward: string,
  moveLeft: string,
  moveRight: string,
  rotateUp: string,
  rotateDown: string,
  rotateLeft: string,
  rotateRight: string,
  twistLeft: string,
  twistRight: string
}

/** 地図操作フラグ */
export type MapControlFlags = {
  zoomIn: boolean,
  zoomOut: boolean,
  moveUp: boolean,
  moveDown: boolean,
  moveFoward: boolean,
  moveBackward: boolean,
  moveLeft: boolean,
  moveRight: boolean,
  rotateUp: boolean,
  rotateDown: boolean,
  rotateLeft: boolean,
  rotateRight: boolean,
  twistLeft: boolean,
  twistRight: boolean
}
