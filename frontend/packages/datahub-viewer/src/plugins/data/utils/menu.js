// Copyright (c) 2025 NTT InfraNet
// @flow
import _ from 'lodash'
import { FILE_TYPE, SUB_FILE_TYPE, TREE_ROOT_INDEX } from '../constants'
import { ASSET_STATUS } from 'plugins/asset/constants'
import { EHV_ASSET_TYPE } from 'plugins/file/constants'

import type { TreeItem } from 'react-complex-tree'

// アイテムがフォルダもしくは変換済みの場合はtrueを返す
const processingItemExclusion = node => {
  if (node?.status === ASSET_STATUS.CONVERTED || node?.isDirectory) {
    return true
  }
  return false
}

// subFileTypeを返す
const getSubFileType = item => {
  if (item.isDirectory) return 0
  if (item.ehvAssetType === EHV_ASSET_TYPE.EHV_TILE) {
    return SUB_FILE_TYPE.ASSET.TOPOGRAPHY
  }
  return SUB_FILE_TYPE.ASSET.DESIGNFILE
}

// viewStructureから取得したchildrenをtreeItemsに変換する
const convertChildren = item => {
  if (!item) return []
  return item
    .filter(item => processingItemExclusion(item))
    .map(item => convertItem(item))
}

// viewStructureから取得したdateをtreeItemsに変換する
const convertItem = item => {
  return {
    name: item.name,
    title: item.displayName,
    isDirectory: item.isDirectory || false,
    expanded: item.expanded || false,
    nodeID: item.nodeID,
    status: item?.status || '',
    referenceId: item?.referenceId || '',
    ehvAssetType: item?.ehvAssetType || '',
    formatType: item?.formatType || '',
    createdAt: item?.createdAt || '',
    fileType: item?.isDirectory ? 0 : FILE_TYPE.ASSET,
    subFileType: getSubFileType(item),
    children: convertChildren(item.children)
  }
}

export const getTreeItems = (viewStructure: any): Object => {
  // viewStructureの成型前にTOPノードの情報を取得
  const topNodeIds = viewStructure.elements.map(node => node.nodeID)

  // viewStructure成型用関数
  let index = 1
  const treeItems = {}
  const processNode = node => {
    if (!node.isDirectory && node.status !== ASSET_STATUS.CONVERTED) return
    const nodeIndex = index++
    treeItems[nodeIndex] = {
      index: nodeIndex,
      data: convertItem(node),
      canMove: true,
      hasChildren: !!(node.children && node.children.length > 0),
      children: node.children
        ? node.children
            .filter(child => processingItemExclusion(child))
            .map(child => processNode(child, nodeIndex))
        : []
    }
    return nodeIndex
  }
  viewStructure.elements.forEach(node => processNode(node))

  // TOPノード以外の表示できるファイルを持たない空ノードを削除
  Object.values(treeItems).forEach(item => {
    if (
      item.hasChildren &&
      item.children.length === 0 &&
      !topNodeIds.includes(item.data.nodeID)
    ) {
      delete treeItems[item.index]
    }
  })

  // TOPノードの情報を追加
  treeItems[TREE_ROOT_INDEX] = {
    index: TREE_ROOT_INDEX,
    canMove: true,
    hasChildren: true,
    children: Object.keys(treeItems)
      .filter(key => topNodeIds.includes(treeItems[key].data.nodeID))
      .map(item => Number(item)),
    data: {
      title: 'TOP',
      name: 'TOP',
      isDirectory: true
    }
  }

  return { treeItems }
}

export const getParentItem = (treeItems: Object, index: any) =>
  Object.values(treeItems).find(item =>
    item.children?.some(child => child === index)
  )

export const moveTreeItems = (
  treeItems: Object,
  srcItems: Array<TreeItem<any>>,
  destParentIndex: number,
  destChildIndex: number
): Object => {
  const result = { ...treeItems }
  const destParent = treeItems[destParentIndex]
  // 選択したアイテムは自動的に選択順でソートされたため、昇順ソートする
  srcItems.sort((item1, item2) => item1.index - item2.index)

  let insertOffset = 0
  for (const srcItem of srcItems) {
    const srcIndex = srcItem.index
    if (srcIndex === destParentIndex) {
      continue
    }

    const srcParent = Object.values(treeItems).find(item =>
      item.children?.includes(srcIndex)
    )
    if (!srcParent || !srcParent.children || !destParent.hasChildren) {
      return treeItems
    }

    let isMovedToBelow = false
    if (srcParent.index !== destParentIndex) {
      // eslint-disable-next-line
      result[srcParent.index].children = result[
        srcParent.index
      ].children.filter(child => child !== srcIndex)
    } else if (destChildIndex !== -1) {
      isMovedToBelow =
        ((destParent.children ?? []).findIndex(child => child === srcIndex) ??
          Infinity) < destChildIndex
    } else {
      continue
    }

    let newChildren
    if (destChildIndex !== -1) {
      newChildren = [...(destParent.children ?? [])].filter(
        child => child !== srcIndex
      )
      newChildren.splice(
        destChildIndex + (isMovedToBelow ? -1 : insertOffset++),
        0,
        srcIndex
      )
    } else {
      newChildren = [...(destParent.children ?? []), srcIndex]
    }
    result[destParentIndex].children = newChildren
  }

  return setTreeIndex(result)
}

export const addFolder = (
  treeItems: Object,
  targetIndex: number,
  name: string
) => {
  let indexArray = [
    ...Object.keys(treeItems).filter(index => index !== TREE_ROOT_INDEX)
  ]
  let preIndex = 1
  if (indexArray.length > 0) {
    preIndex =
      Math.max(
        ...Object.keys(treeItems).filter(index => index !== TREE_ROOT_INDEX)
      ) + 1
  }
  treeItems[preIndex] = {
    index: preIndex,
    data: {
      title: name,
      name: name,
      isDirectory: true,
      expanded: false,
      children: []
    },
    canMove: true,
    hasChildren: true,
    children: []
  }
  treeItems[targetIndex].children = [
    ...treeItems[targetIndex].children,
    preIndex
  ]
  return setTreeIndex(treeItems)
}

export const setTreeIndex = (treeItems: Object) => {
  const rootItemIndices = treeItems[TREE_ROOT_INDEX].children
  let count = 1
  let rootChildren = []
  const newTreeItems = rootItemIndices.reduce((previous, current) => {
    rootChildren.push(count)
    count = recursionSetTreeIndex(treeItems, previous, current, count)
    return previous
  }, {})
  newTreeItems[TREE_ROOT_INDEX] = {
    ...treeItems[TREE_ROOT_INDEX],
    children: rootChildren
  }
  return newTreeItems
}

export const recursionSetTreeIndex = (
  srcTreeItems: Object,
  destTreeItems: Object,
  targetIndex: Object,
  count: number
) => {
  let currentCount = count
  const treeItem = _.cloneDeep(srcTreeItems[targetIndex])
  treeItem.index = currentCount++
  treeItem.data.nodeID = treeItem.index
  destTreeItems[treeItem.index] = treeItem
  if (treeItem.hasChildren && treeItem.children) {
    let newChildren = []
    treeItem.children.forEach(child => {
      newChildren.push(currentCount)
      currentCount = recursionSetTreeIndex(
        srcTreeItems,
        destTreeItems,
        child,
        currentCount
      )
    })
    treeItem.children = newChildren
    treeItem.data.children = newChildren.map(child => destTreeItems[child].data)
  }
  return currentCount
}

export const recursionDeleteTreeItem = (treeItems: Object, index: number) => {
  Object.values(treeItems).forEach(item => {
    if (item.index === index) {
      if (item.hasChildren && item.children) {
        item.children.forEach(child =>
          recursionDeleteTreeItem(treeItems, child)
        )
      }
      delete treeItems[index]
    }
    if (
      item.hasChildren &&
      item.children &&
      item.children.some(child => child === index)
    ) {
      item.children = item.children.filter(child => child !== index)
    }
  })
}

export const createViewStructure = (treeItems: Object) => {
  const categorizedItemIndices = treeItems[TREE_ROOT_INDEX].children
  return categorizedItemIndices.map(index =>
    recursionCreateViewStructure(treeItems, index)
  )
}

export const recursionCreateViewStructure = (
  treeItems: Object,
  targetIndex: number
) => {
  const targetItem = treeItems[targetIndex]
  const result = targetItem.data
  console.log('recursionCreateViewStructure', treeItems)

  if (
    targetItem.hasChildren &&
    targetItem.children &&
    targetItem.children.length
  ) {
    result.children = targetItem.children.map(child =>
      recursionCreateViewStructure(treeItems, child)
    )
  }
  return result
}
