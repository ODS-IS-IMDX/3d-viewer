// Copyright (c) 2025 NTT InfraNet
// @flow
import { call, put, select } from 'redux-saga/effects'
import type { Saga } from 'redux-saga'
import { api } from 'addons/api'
import { getDeleteItem } from '../selectors/delete'
import { getSiteId } from 'plugins/site/selectors'
import { setViewStructure } from 'plugins/site/actions'
import type { DeleteItem } from '../types'
import { setLoading, type DataDeleteFileAction } from '../actions'
import { generateErrorMessage } from '../utils/generateMessage'
import { notifyError } from 'plugins/notifications/actions'
import {
  createViewStructure,
  recursionDeleteTreeItem,
  setTreeIndex
} from '../utils'
import { ROOT_ELEMENT } from '../constants'
import { getViewStructure } from '../../site/selectors'

function * bulkDelete (action: DataDeleteFileAction): Saga<void> {
  try {
    yield put(setLoading({ isLoading: true }))
    const siteId = yield select(getSiteId)
    const treeItem = action.payload.treeItems
    const deleteItem: DeleteItem = yield select(getDeleteItem)

    let assetParamObj = {}
    let targetArray = []

    if (deleteItem.asset.length > 0) {
      assetParamObj = {
        type: 'asset',
        ids: []
      }

      deleteItem.asset.forEach(value => {
        assetParamObj.ids.push(value.id)
      })

      targetArray.push(assetParamObj)
    }

    const parameters = {
      siteId: siteId,
      body: {
        targetList: targetArray
      }
    }

    if (targetArray.length > 0) {
      // $FlowFixMe
      yield call(api.deleteSiteMultipleData, parameters)
    }

    // フォルダー一括削除
    let newTreeItems = treeItem
    deleteItem.folder.map(value => {
      const targetItem = value
      return recursionDeleteTreeItem(newTreeItems, targetItem.index)
    })
    newTreeItems = setTreeIndex(newTreeItems)
    const viewStructure = yield select(getViewStructure)
    const savedTreeItems = viewStructure
    const newViewStructure = createViewStructure(newTreeItems)
    savedTreeItems[ROOT_ELEMENT] = newViewStructure
    yield put(setViewStructure(savedTreeItems))
  } catch (e) {
    const message = generateErrorMessage(e)
    yield put(notifyError(message))
  } finally {
    yield put(setLoading({ isLoading: false }))
  }
}

export default bulkDelete
