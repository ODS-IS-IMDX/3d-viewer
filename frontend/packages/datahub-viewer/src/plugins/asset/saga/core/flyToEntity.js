// Copyright (c) 2025 NTT InfraNet
// @flow
import { select } from 'redux-saga/effects'

import type { CesiumIonTypes } from 'plugins/asset/types'
import { getViewer } from 'plugins/site/selectors'

function * flyToEntitySaga ({
  param
}: {
  param: {
    entityId: string,
    dataSourceName: string,
    ionAssetType: CesiumIonTypes
  }
}): Saga<void> {
  const viewer = yield select(getViewer)
  const { entityId } = param
  const primitives = viewer.scene.primitives
  const primitivesLength = primitives.length
  let primitive
  for (let i = 0; i < primitivesLength; i++) {
    primitive = primitives.get(i)
    if (primitive.assetId === entityId) break
  }

  if (primitive) {
    viewer.flyTo(primitive)
  }
}

export default flyToEntitySaga
