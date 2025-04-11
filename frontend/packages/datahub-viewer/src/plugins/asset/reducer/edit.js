// Copyright (c) 2025 NTT InfraNet
// @flow
import { cloneDeep } from 'lodash'

import { Matrix4, TransformEditor } from 'cesium'
import {
  ASSET_SET_ASSET_DATA,
  ASSET_SET_TRANSFORM_EDITOR,
  ASSET_UPDATE_EDITING_DATA,
  ASSET_CLEAR_EDIT_ASSET,
  type AssetAction
} from 'plugins/asset/actions'
import type { AssetID } from 'plugins/asset/reducer'
import type { Coordinates } from 'plugins/asset/types'

export type AssetMetaData = {
  assetId: AssetID,
  subFileType: number,
  name: string
}

export type Rotate = {
  heading: number,
  pitch: number,
  roll: number
}
export type AssetEditingData = {
  displayName: string,
  coordinates: Coordinates,
  startDateTime: Date,
  endDateTime: Date
}

export type AssetEditState = {
  target: AssetMetaData,
  originModelMatrix: Matrix4,
  transformEditor: TransformEditor,
  modelMatrix: Matrix4,
  rootTransform: Matrix4,
  editingData: AssetEditingData
}

const initialState = {
  target: {},
  originModelMatrix: null,
  transformEditor: null,
  modelMatrix: null,
  rootTransform: null,
  editingData: {}
}

const editReducer = (
  state: AssetEditState = initialState,
  action: AssetAction
) => {
  switch (action.type) {
    case ASSET_SET_ASSET_DATA:
      return {
        ...state,
        target: {
          ...state.target,
          assetId: action.payload.assetId,
          subFileType: action.payload.subFileType,
          name: action.payload.name
        }
      }
    case ASSET_SET_TRANSFORM_EDITOR:
      return {
        ...state,
        originModelMatrix: action.payload.originModelMatrix,
        transformEditor: action.payload.transformEditor,
        modelMatrix: action.payload.modelMatrix,
        rootTransform: action.payload.rootTransform
      }
    case ASSET_UPDATE_EDITING_DATA:
      return {
        ...state,
        editingData: {
          ...state.editingData,
          displayName:
            action.payload.displayName || state.editingData.displayName,
          coordinates: action.payload.coordinates
            ? cloneDeep(action.payload.coordinates)
            : state.editingData.coordinates,
          startDateTime:
            action.payload.startDateTime === undefined
              ? state.editingData.startDateTime
              : action.payload.startDateTime === null ||
                action.payload.startDateTime === ''
              ? null
              : action.payload.startDateTime.toISOString(),
          endDateTime:
            action.payload.endDateTime === undefined
              ? state.editingData.endDateTime
              : action.payload.endDateTime === null ||
                action.payload.endDateTime === ''
              ? null
              : action.payload.endDateTime.toISOString()
        }
      }
    case ASSET_CLEAR_EDIT_ASSET:
      return {
        ...state,
        ...initialState
      }
    default:
      return state
  }
}

export default editReducer
