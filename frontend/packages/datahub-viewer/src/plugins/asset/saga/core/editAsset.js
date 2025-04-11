// Copyright (c) 2025 NTT InfraNet
// @flow
import { call, put, select } from 'redux-saga/effects'
import type { Saga } from 'redux-saga'
import i18n from 'i18n'
import { Matrix4 } from 'cesium'
import { api } from 'addons/api'
import { notifySuccess, notifyError } from 'plugins/notifications/actions'
import { getSiteId, getViewer } from 'plugins/site/selectors'
import { cancelEditAsset, enableDrawerButton, updateList } from '../../actions'
import type { AssetEditAction } from '../../actions'
import { getTopographyList } from '../../selectors/topography'
import { getDesignfileList } from '../../selectors/designfile'
import { getOriginData, getAssetList } from '../../selectors'

// AssetEditAction.payloadの中身は：{ assetId: AssetID, displayName: string, startDateTime: Date,endDateTime: Date }
export function * editAssetSaga ({
  param
}: {
  param: AssetEditAction.payload
}): Saga<void> {
  const {
    assetId,
    displayName,
    startDateTime,
    endDateTime,
    displayConditions
  } = param
  const siteId = yield select(getSiteId)

  const assetList = yield select(getAssetList)
  const { ionAssetId } = assetList.find(asset => asset.id === assetId) || {}
  if (!ionAssetId) return

  const { originModelMatrix, modelMatrix } = yield select(getOriginData)
  const isEditTileset = !!modelMatrix

  try {
    const body = {
      displayName,
      startDateTime: startDateTime || null,
      endDateTime: endDateTime || null,
      customStyle:
        Array.isArray(displayConditions) && displayConditions.length > 0
          ? { conditions: displayConditions }
          : null
    }
    if (isEditTileset) {
      // Cesium.Viewerオブジェクトを取得
      const viewer = yield select(getViewer)

      const primitives = viewer.scene.primitives
      const primitivesLength = primitives.length
      let primitive
      for (let i = 0; i < primitivesLength; i++) {
        primitive = primitives.get(i)
        if (primitive.assetId === ionAssetId) break
      }

      if (
        primitive.modelMatrix &&
        !Matrix4.equals(modelMatrix, primitive.modelMatrix)
      ) {
        if (Matrix4.equals(originModelMatrix, primitive.modelMatrix)) {
          body.customPosition = {}
        } else {
          body.customPosition = {
            transform: Matrix4.toArray(primitive.modelMatrix)
          }
        }
      }
    }

    yield call(api.putSiteAsset, {
      assetId,
      siteId,
      body
    })
    if (isEditTileset) {
      yield put(cancelEditAsset())
    }
    yield put(updateList(siteId))
    yield put(
      notifySuccess(i18n.t('data:menuItem.asset.editModal.completeMessage'))
    )
  } catch (e) {
    const topographyList = yield select(getTopographyList)
    const designfileList = yield select(getDesignfileList)
    const asset =
      topographyList.find(topography => topography.id === assetId) ||
      designfileList.find(designfile => designfile.id === assetId)
    const assetName = asset ? asset.name : ''
    yield put(
      notifyError(
        i18n.t('asset:common.notification.assetUpdateErrorMessage', {
          assetName
        })
      )
    )
  }
  if (isEditTileset) {
    yield put(enableDrawerButton())
  }
}
