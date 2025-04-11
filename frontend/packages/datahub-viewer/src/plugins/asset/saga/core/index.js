// Copyright (c) 2025 NTT InfraNet
// @flow
import { takeEvery } from 'redux-saga/effects'

import { unwrap } from 'utils/saga'
import { SITE_LOAD_SELECTED_SUCCESS } from 'plugins/site/actions'
import {
  ASSET_EDIT,
  ASSET_UPDATE_LIST,
  ASSET_SET_ASSET_STYLE,
  ASSET_RESET_ASSET_STYLE,
  ASSET_FLY_TO_ENTITY,
  ASSET_INIT_EDITING_DATA,
  ASSET_CANCEL_EDIT_ASSET,
  ASSET_GET_SELECTED_FROM_LATEST
} from '../../actions'
import loadAssets from './loadAssets'
import { editAssetSaga } from './editAsset'
import { setStyle } from './setStyle'
import { resetStyle } from './resetStyle'
import flyToEntity from './flyToEntity'
import { initEditingDataSaga } from './initEditingData'
import { cancelEditAssetSaga } from './cancelEditAsset'
import getSelectedAssetFromLatest from './getSelectedAssetFromLatest'

export default function * saga () {
  yield takeEvery(ASSET_EDIT, unwrap(editAssetSaga))
  yield takeEvery(
    [SITE_LOAD_SELECTED_SUCCESS, ASSET_UPDATE_LIST],
    unwrap(loadAssets)
  )
  yield takeEvery(ASSET_GET_SELECTED_FROM_LATEST, getSelectedAssetFromLatest)
  yield takeEvery(ASSET_SET_ASSET_STYLE, unwrap(setStyle))
  yield takeEvery(ASSET_RESET_ASSET_STYLE, unwrap(resetStyle))
  yield takeEvery(ASSET_FLY_TO_ENTITY, unwrap(flyToEntity))
  yield takeEvery(ASSET_INIT_EDITING_DATA, unwrap(initEditingDataSaga))
  yield takeEvery(ASSET_CANCEL_EDIT_ASSET, unwrap(cancelEditAssetSaga))
}
