// Copyright (c) 2025 NTT InfraNet
// @flow
import { type AdditionalReducers } from 'utils/reducer'
import {
  ASSET_SET_ASSET_PARAMS,
  ASSET_SET_ASSET_RENDERING,
  TOPOGRAPHY_SET_VISIBILITY,
  DESIGNFILE_SET_VISIBILITY,
  TOPOGRAPHY_NOTIFY_RENDERING_COMPLETED,
  DESIGNFILE_NOTIFY_RENDERING_COMPLETED,
  ASSET_SET_ASSET_AVAILABLE,
  TOPOGRAPHY_SET_POINTSIZE,
  TOPOGRAPHY_SET_TRANSPARENCY,
  ASSET_SET_ASSET_STYLE,
  ASSET_SET_ASSET_IS_TRANSPARENCY,
  ASSET_SET_SELECTED_ITEM
} from '../actions'
import { type AssetListState } from './index'
import { saveSettings } from '../../../utils/storage'
import { saveDataType } from '../../../constants'

const setAssetParams = (state, action) => {
  const { isAssetRegistable } = action.payload

  return {
    ...state,
    isAssetRegistable
  }
}

const setAssetRenderingState = (state, action) => {
  const { isRenderingStatus } = state
  isRenderingStatus[action.payload.id] = action.payload.isRendering
  return {
    ...state,
    isRenderingStatus
  }
}

const setAssetRenderingCompleted = (state, action) => {
  const { id } = action.payload
  const { isRenderingStatus } = state
  isRenderingStatus[action.payload.id] = false

  // idが一致するitemを更新
  const newItems = state.items.map(item =>
    item.id !== id ? item : { ...item, isLoaded: true }
  )
  return {
    ...state,
    items: newItems,
    isRenderingStatus
  }
}

const updateAssetVisibility = (state, action) => {
  const { id, isVisible } = action.payload

  // 既にロード済みの場合はisDisplayのみ変更
  if (
    state.items.filter(
      item => item.id === id && item.isLoaded && item.isAvailable
    ).length > 0
  ) {
    return {
      ...state,
      items: state.items.map(item =>
        item.id !== id ? item : { ...item, isDisplay: isVisible }
      )
    }
  }

  // idが一致するitemを更新(isAvailableを有効にする)
  const newItems = state.items.map(item =>
    item.id !== id
      ? item
      : {
          ...item,
          isDisplay: isVisible,
          isAvailable: true,
          isLoaded: item.isLoaded
        }
  )

  const { isRenderingStatus } = state

  if (
    (action.type === DESIGNFILE_SET_VISIBILITY ||
      action.type === TOPOGRAPHY_SET_VISIBILITY) &&
    action.payload.isVisible
  ) {
    isRenderingStatus[action.payload.id] = true
    return {
      ...state,
      items: newItems,
      isRenderingStatus
    }
  } else {
    return {
      ...state,
      items: newItems
    }
  }
}
const updateAssetPointSize = (state, action) => {
  const { id, pointSize } = action.payload

  return {
    ...state,
    items: state.items.map(item =>
      item.id !== id ? item : { ...item, pointSize: pointSize }
    )
  }
}
const updateAssetStyle = (state, action) => {
  const {
    id,
    style,
    transparency,
    textureBrightness,
    modelBrightness
  } = action.payload
  return {
    ...state,
    items: state.items.map(item => {
      if (item.id !== id) {
        return item
      } else {
        const oldStyle = item.style || { color: '' }
        const newStyle = style || {
          ...oldStyle,
          transparency,
          textureBrightness,
          modelBrightness
        }
        return { ...item, style: newStyle }
      }
    })
  }
}
const setAssetIsTransparency = (state, action) => {
  const { id, isTransparency } = action.payload
  return {
    ...state,
    items: state.items.map(item =>
      item.id !== id ? item : { ...item, isTransparency: isTransparency }
    )
  }
}

const setAssetAvailable = (state, action) => {
  const { id, isAvailable } = action.payload
  // localStrageに保存
  saveSettings({
    dataType: saveDataType.ASSET,
    id: id,
    isAvailable: isAvailable
  })
  // idが一致するitemを更新
  const newItems = state.items.map(item =>
    item.id !== id
      ? item
      : { ...item, isAvailable: isAvailable, isLoaded: false }
  )
  return {
    ...state,
    items: newItems
  }
}

const setSelectedAssetItem = (state, action) => {
  const { selectedAssetItem } = action.payload
  return {
    ...state,
    selectedAssetItem: selectedAssetItem
  }
}

const additionalAssetListReducers: AdditionalReducers<AssetListState> = {
  [ASSET_SET_ASSET_PARAMS]: setAssetParams,
  [ASSET_SET_ASSET_RENDERING]: setAssetRenderingState,
  [ASSET_SET_ASSET_AVAILABLE]: setAssetAvailable,
  [TOPOGRAPHY_NOTIFY_RENDERING_COMPLETED]: setAssetRenderingCompleted,
  [DESIGNFILE_NOTIFY_RENDERING_COMPLETED]: setAssetRenderingCompleted,
  [DESIGNFILE_SET_VISIBILITY]: updateAssetVisibility,
  [TOPOGRAPHY_SET_VISIBILITY]: updateAssetVisibility,
  [TOPOGRAPHY_SET_POINTSIZE]: updateAssetPointSize,
  [TOPOGRAPHY_SET_TRANSPARENCY]: updateAssetStyle,
  [ASSET_SET_ASSET_STYLE]: updateAssetStyle,
  [ASSET_SET_ASSET_IS_TRANSPARENCY]: setAssetIsTransparency,
  [ASSET_SET_SELECTED_ITEM]: setSelectedAssetItem
}

export default additionalAssetListReducers
