// Copyright (c) 2025 NTT InfraNet
// @flow
import { createListReducer, type EntityListState } from 'utils/reducer'
import {
  ASSET_LOAD_LIST,
  ASSET_LOAD_LIST_SUCCESS,
  ASSET_LOAD_LIST_ERROR,
  type AssetAction
} from '../actions'
import additionalAssetListReducers from './additionalAssetListReducers'
import { ASSET_STATUS } from '../constants'
import { type AssetType, type CesiumIonTypes } from '../types'

// Type definitions
export type AssetID = string

export type User = {
  firstName: string,
  lastName: string,
  email: string
}

export type AssetStatus = $Keys<typeof ASSET_STATUS>

export type AssetCustomPosition = {
  isDecimalCoordinate: boolean,
  lat: {
    decimal: number | '',
    degree: number | '',
    minute: number | '',
    second: number | ''
  },
  lon: {
    decimal: number | '',
    degree: number | '',
    minute: number | '',
    second: number | ''
  },
  ellipsoidHeight: number | '',
  heading: number | '',
  pitch: number | '',
  roll: number | ''
}

export type Asset = {
  id: AssetID,
  ionAssetId: number,
  /** ISO 8601形式 例：2020-09-14T05:47:44.746Z */
  createdAt: string,
  /** ISO 8601形式 例：2020-09-14T05:47:44.746Z */
  updatedAt: string,
  createdBy: User,
  displayName: string,
  formatType: string,
  name: string,
  status: AssetStatus,
  category: AssetType,
  displayOrder: number,
  isDisplay: boolean,
  isLoaded: boolean,
  isAvailable: boolean,
  isMeasurement: boolean,
  isClampToSurface: boolean,
  isBackFaceDisplay: boolean,
  ionAssetType: CesiumIonTypes,
  pointSize: number,
  style: {
    transparency: number,
    /** 色(css color string) */
    color: string
  },
  /** 透明化可否 */
  isTransparency: boolean,
  /** アセットデータの開始時間(ISO 8601形式) 例：2020-09-14T05:47:44.746Z */
  startDateTime: null | string,
  /** アセットデータの終了時間(ISO 8601形式) 例：2020-09-14T05:47:44.746Z */
  endDateTime: null | string,
  isFilterMode?: boolean
}
export type AssetBase = {
  id: AssetID,
  ionAssetId: number,
  name: string,
  status: AssetStatus,
  isDisplay: boolean,
  isLoaded: boolean,
  isAvailable: boolean,
  displayOrder: number,
  isClampToSurface: boolean,
  isBackFaceDisplay: boolean,
  ionAssetType: CesiumIonTypes,
  /** アセットデータの開始時間(ISO 8601形式) 例：2020-09-14T05:47:44.746Z */
  startDateTime: null | string,
  /** アセットデータの終了時間(ISO 8601形式) 例：2020-09-14T05:47:44.746Z */
  endDateTime: null | string,
  style: {
    transparency: number,
    /** 色(css color string) */
    color: string
  },
  isTransparency: boolean
}

export type Topography = {
  ...AssetBase,
  customPosition: null | { transform: Array<number> },
  category: 'topography'
}

export type Designfile = {
  ...AssetBase,
  category: 'designFile'
}

export type AssetRenderingState = { status: { id: boolean } }

export type AssetListState = {
  ...EntityListState<Asset>
}

export type AssetListReducer = (
  state: AssetListState,
  action: AssetAction
) => AssetListState

// Reducer
const initialState = {
  isLoading: false,
  items: [],
  isAssetRegistable: true,
  isRenderingStatus: {},
  selectedAssetItem: {}
}

const assetListReducer: AssetListReducer = createListReducer<Asset>(
  ASSET_LOAD_LIST,
  ASSET_LOAD_LIST_ERROR,
  ASSET_LOAD_LIST_SUCCESS,
  initialState,
  additionalAssetListReducers
)

export default assetListReducer
