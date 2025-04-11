// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { memo, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { ControlledTreeEnvironment, Tree } from 'react-complex-tree'
import _ from 'lodash'
import { Box, Button, ClickOutside, Flex, Text } from '@ehv/datahub-components'
import { IconPlusBlue } from '@ehv/datahub-icons'
import {
  ROOT_ELEMENT,
  TREE_ID,
  TREE_ROOT_INDEX,
  MENU_MODE,
  RENDER_DEPTH_OFFSET
} from 'plugins/data/constants'
import {
  addFolder,
  createViewStructure,
  getParentItem,
  getTreeItems,
  moveTreeItems
} from 'plugins/data/utils'
import { MenuItem } from '../MenuItem'
import UpdateFolderModal from './UpdateFolderModal'

import type { FC, ReactElement } from 'react'
import type { TFunction } from 'react-i18next'
import type { TreeItem } from 'react-complex-tree'
import type { Asset } from 'plugins/asset/reducer'
import MenuConfirmModal from '../MenuConfirmModal'
import type { DeleteItem } from '../../types'
import MenuItemDeleteModal from '../MenuItemDeleteModal'

/**
 * 削除エリアに移動してアイテムを削除するイベントかどうかのフラグ
 * (この変数の変化によって再レンダリングしないため、useStateを使わずにfunction componentの外に定義)
 */
let isDropDelete = false

const MenuEditContainer = styled(Flex)`
  overflow-y: auto;
  height: calc(100vh - 250px);
  background-color: #fafafa;
  .rct-tree-item-li::marker {
    content: none;
  }
  .rct-tree-item-button {
    width: 100%;
    text-align: left;
    background-color: #fafafa;
    border: none;
  }
`
const ActionArea = styled(Flex)`
  padding: 16px 8px 8px 8px;
`
const ActionText = styled(Flex)`
  cursor: pointer;
  color: #15aae3;

  &:hover {
    color: #0084b5;

    & circle {
      fill: #0084b5;
    }
  }
`
const StyledText = styled(Text)`
  color: inherit;
`
const ActionButton = styled(Button)`
  min-width: 60px;
  border-radius: 5px;
`
// -${RENDER_DEPTH_OFFSET}px:
// renderDepthOffsetを設定したら、ルートのMenuItemも右側にオフセットしてしまうので、その分を戻すため
const TreeContainer = styled.div`
  margin: 8px 0 0 -${RENDER_DEPTH_OFFSET}px;
`
const ItemContainer = styled(Box)`
  outline: none;
  border: 1px solid ${({ isFocused }) => (isFocused ? '#ccc' : 'transparent')};
  ${({ isSelected, isDraggingOver, hasChildren }) =>
    isSelected || (isDraggingOver && hasChildren)
      ? 'background-color: #eee;'
      : '&:hover {background-color: #f6f6f6;}'}
`

const IconWrapper = styled.div`
  margin-right: 8px;
  width: 18px;
  height: 18px;
  line-height: 0;
`
const BetweenLine = styled.div`
  position: absolute;
  right: 0px;
  top: ${({ targetType, linePosition }) =>
    targetType === 'between-items' && linePosition === 'top'
      ? '0px'
      : targetType === 'between-items' && linePosition === 'bottom'
      ? '-2px'
      : '-1px'};
  left: ${({ depth }) => depth * 23}px;
  height: 2px;
  background-color: #16abe3;
`

const DeleteArea = styled(Flex)`
  height: 100px;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 0px 30px;
  background-color: rgb(246, 246, 246);
  border: 2px dashed rgb(216, 216, 216);
  margin-top: 5px;
`

type MenuEditProps = {
  t: TFunction,
  assetList: Array<Asset>,
  enableClickOutsideCloseMenuEdit: boolean,
  viewStructure: any,
  setViewStructure: (data: any) => void,
  changeMenuMode: (menuMode: string) => void,
  notifyError: (errorMessage: string) => void,
  setDeleteItem: (deleteItem: DeleteItem) => void
}
const Menu: FC<MenuEditProps> = ({
  t,
  assetList,
  enableClickOutsideCloseMenuEdit,
  viewStructure,
  setViewStructure,
  changeMenuMode,
  notifyError,
  setDeleteItem,
  ...props
}: MenuEditProps): ReactElement => {
  const { treeItems } = getTreeItems(viewStructure)
  const [treeItemsData, setTreeItemsData] = useState(treeItems)
  const [fileNumber, setFileNumber] = useState(assetList.length)
  // treeItemsはstateに保持されているため、ファイル数変更があったらtreeItemsを更新する
  if (fileNumber !== assetList.length) {
    setTreeItemsData(treeItems)
    setFileNumber(assetList.length)
  }
  const [focusedItem, setFocusedItem] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [expandedItems, setExpandedItems] = useState([])

  const initialSelectedData = {
    id: TREE_ROOT_INDEX,
    name: 'TOP',
    data: treeItemsData[TREE_ROOT_INDEX].data,
    item: treeItemsData[TREE_ROOT_INDEX],
    file: {},
    isDirectory: true,
    isOrigin: false,
    enableDelete: false
  }
  const [selectedFolderData, setSelectedFolderData] = useState(
    initialSelectedData
  )
  const [selectedItemData, setSelectedItemData] = useState(initialSelectedData)
  const [isAddFolder, setIsAddFolder] = useState(false)
  const [isUpdateFolderModalOpen, setIsUpdateFolderModalOpen] = useState(false)
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
  const [isOpenMenuItemModal, setIsOpenMenuItemModal] = useState(false)

  const handleDropItem = (items: Array<TreeItem<any>>, target: any) => {
    if (isDropDelete) {
      isDropDelete = false
      return
    }

    // 親->子、親->孫、複数フォルダのうち１つでも親->子の移動があれば移動禁止
    const isParentToChild = checkParentToChild(items, target)
    if (!isParentToChild) {
      return
    }

    for (const item of items) {
      // 移動先に同名ファイル存在するかどうかをチェック
      if (
        item.data.isDirectory &&
        chkDuplicateName(
          item.data.name,
          treeItemsData[target.targetItem || target.parentItem].children,
          item.index
        )
      ) {
        notifyError(t('menuItem.folder.moveFolderSameNameErrMsg'))
        return
      }
    }

    const newTreeItemsData = moveTreeItems(
      treeItemsData,
      items,
      target.targetType === 'item' ? target.targetItem : target.parentItem,
      target.targetType === 'item' ? -1 : target.childIndex
    )
    setTreeItemsData(newTreeItemsData)
    setSelectedItems([])
  }

  const updateFolder = useCallback(
    (name, isAddFolder) => {
      let updateTreeData = _.cloneDeep(treeItemsData)
      if (isAddFolder) {
        const selectedFolderIndex = selectedFolderData.id || TREE_ROOT_INDEX
        addFolder(updateTreeData, selectedFolderIndex, name)
      } else {
        const targetItem = Object.values(treeItemsData).find(
          item => item.index === selectedItemData.id
        )
        const newItem = {
          ...targetItem,
          data: {
            ...targetItem.data,
            name: name,
            title: name
          }
        }
        updateTreeData[targetItem.index] = newItem
        setSelectedItemData(newItem)
      }
      setTreeItemsData(updateTreeData)
      setIsAddFolder(false)
      setIsUpdateFolderModalOpen(false)

      const selectedIndex = selectedFolderData.id
      const item = updateTreeData[selectedIndex]
      const folderItem = item.hasChildren
        ? item
        : getParentItem(treeItemsData, item.index)
      setSelectedFolderData({
        id: folderItem.index,
        item: folderItem
      })
    },
    [treeItemsData, selectedFolderData.id, selectedItemData]
  )

  const chkDuplicateName = (
    name: string,
    targetChildren: number[],
    index = 0
  ) => {
    if (targetChildren != null && targetChildren.length > 0) {
      return (
        targetChildren
          // 該当階層のフォルダのみフィルタリング
          .filter(
            child =>
              treeItemsData[child] && treeItemsData[child].data.isDirectory
          )
          // 名前が同一かつ自分自身ではない
          .some(
            child =>
              treeItemsData[child] &&
              treeItemsData[child].data.title === name &&
              child !== index
          )
      )
    } else {
      return false
    }
  }

  const handleClickAddFolder = useCallback(() => {
    setIsAddFolder(true)
    setIsUpdateFolderModalOpen(true)
  }, [])

  const handleClickSave = useCallback(() => {
    const savedTreeItems = viewStructure
    savedTreeItems[ROOT_ELEMENT] = createViewStructure(treeItemsData)
    setViewStructure(savedTreeItems)
    changeMenuMode(MENU_MODE.SHOW)
  }, [viewStructure, treeItemsData, setViewStructure, changeMenuMode])

  const handleOnClickOutside = () => {
    if (enableClickOutsideCloseMenuEdit && !isOpenMenuItemModal) {
      setIsOpenConfirmModal(true)
    }
  }

  /** 編集破棄確認モーダルを閉じる関数 */
  const handleOnCloseConfirmModal = () => {
    setIsOpenConfirmModal(false)
  }

  /** 編集破棄確認モーダルの「保存」押下用関数 */
  const handleOnClickSave = () => {
    handleClickSave()
  }

  /** 編集破棄確認モーダルの「保存しない」押下用関数 */
  const handleOnClickNotSave = () => {
    changeMenuMode(MENU_MODE.SHOW)
  }

  // ゴミ箱領域へのドラッグアンドドロップイベント取得用
  const ref = React.useRef(null)
  useEffect(() => {
    const handleDragover = event => {
      event.preventDefault()
    }
    const element = ref.current
    if (element) {
      element.addEventListener('dragover', handleDragover)
    }

    return () => {
      if (element) {
        element.removeEventListener('dragover', handleDragover)
      }
    }
  }, [])

  /** ゴミ箱領域にドロップされたときの関数 */
  const handleOnDropDeleteArea = () => {
    !isDropDelete && (isDropDelete = true)

    let selectedTreeNode = []
    if (selectedItems.length > 0) {
      selectedItems.map(value => {
        return selectedTreeNode.push(treeItemsData[value])
      })
    }

    let deleteItem: DeleteItem = {
      asset: [],
      folder: []
    }
    selectedTreeNode.forEach(value => {
      setFileList(deleteItem, value)
    })

    let isDeleteModalDisplay = false
    // deleteItemの中の配列がある場合はdeleteModalを開く
    Object.values(deleteItem).forEach((item: any) => {
      if (item.length > 0) {
        isDeleteModalDisplay = true
      }
    })
    setDeleteItem(deleteItem)
    setIsOpenMenuItemModal(isDeleteModalDisplay)
  }

  /** フォルダ内のファイルまたはフォルダを探し、格納していく */
  const findFolderChildren = (deleteItem: DeleteItem, treeItem: any) => {
    treeItem.children.forEach(value => {
      let folderChildren = []
      folderChildren.push(treeItemsData[value])

      folderChildren.forEach(childValue => {
        setFileList(deleteItem, childValue)
      })
    })
  }

  /** 各ファイルをリストから検索し、格納する */
  const setFileList = (deleteItem: DeleteItem, treeItem: any) => {
    let assetObj = {}
    if (treeItem.hasChildren != null && treeItem.hasChildren) {
      const isExist = deleteItem.folder.includes(treeItem)
      if (!isExist) {
        deleteItem.folder.push(treeItem)
      }
      findFolderChildren(deleteItem, treeItem)
    } else {
      assetObj = assetList.find(asset => asset.id === treeItem.data.referenceId)
      if (assetObj != null) {
        const isExist = deleteItem.asset.includes(assetObj)
        if (!isExist) {
          deleteItem.asset.push(assetObj)
        }
      }
    }
  }

  /** nodeIndexからtreeDataを取得する関数 */
  const getTreeData = (index: any) => {
    let result: Object = null
    result = Object.values(treeItemsData).find(Data => Data.index === index)
    return result
  }

  /** ドラッグしたnodeの子供を検索し、ドロップ先のnodeIndexがいるかチェック */
  const checkExistChild = (dragTreeData: Object, dropTargetIndex: any) => {
    let result = true

    const children = dragTreeData.children

    if (children != null) {
      for (let j = 0; j < children.length; j++) {
        if (!result) {
          break
        }

        let childIndex = children[j]
        if (childIndex === dropTargetIndex) {
          result = false
        } else {
          const treeData = getTreeData(childIndex)
          result = checkExistChild(treeData, dropTargetIndex)
        }
      }
    }

    return result
  }

  /** items: ドラッグ元（配列） target: ドロップ先 */
  const checkParentToChild = (dragItems: any, dropTarget: any) => {
    let result = true
    for (let i = 0; i < dragItems.length; i++) {
      // hasChildrenでフォルダかそうで無いか判断するようにする。
      if (dragItems[i].hasChildren != null) {
        const dragIndex = dragItems[i].index
        const dropTargetIndex =
          dropTarget.targetItem != null
            ? dropTarget.targetItem
            : dropTarget.parentItem

        // dragしたnodeのindexからデータを取得
        const dragTreeData: any = getTreeData(dragIndex)
        if (dragTreeData.children.length > 0) {
          result = checkExistChild(dragTreeData, dropTargetIndex)

          if (!result) {
            break
          }
        }
      }
    }

    return result
  }

  /** 削除後に選択stateを初期化する。 */
  const resetSelectedData = () => {
    setSelectedItemData(initialSelectedData)
    setSelectedFolderData(initialSelectedData)
    setFocusedItem([])
    setSelectedItems([])
  }

  return (
    <ClickOutside onClickOutside={() => handleOnClickOutside()}>
      <>
        <MenuConfirmModal
          isOpen={isOpenConfirmModal}
          handleModalClose={() => handleOnCloseConfirmModal()}
          handleOnClickSave={() => handleOnClickSave()}
          handleOnClickNotSave={() => handleOnClickNotSave()}
        />
        <ActionArea justifyContent='space-between'>
          <ActionText alignItems='center' onClick={handleClickAddFolder}>
            <IconWrapper>
              <IconPlusBlue />
            </IconWrapper>
            <StyledText>{t('dataAdmin.modal.addFolder')}</StyledText>
          </ActionText>
          <ActionButton fontSize={12} onClick={handleClickSave}>
            {t('dataAdmin.modal.save')}
          </ActionButton>
        </ActionArea>
        <MenuEditContainer flexDirection='column'>
          <ControlledTreeEnvironment
            items={treeItemsData}
            getItemTitle={item => item.data.title}
            viewState={{
              [TREE_ID]: {
                focusedItem,
                expandedItems,
                selectedItems
              }
            }}
            canDragAndDrop
            canReorderItems
            canDropOnItemWithChildren
            canDropOnItemWithoutChildren
            renderDepthOffset={RENDER_DEPTH_OFFSET}
            canSearch={false}
            canRename={false}
            onFocusItem={item => setFocusedItem(item.index)}
            onExpandItem={item =>
              setExpandedItems([...expandedItems, item.index])
            }
            onCollapseItem={item =>
              setExpandedItems(
                expandedItems.filter(itemIndex => itemIndex !== item.index)
              )
            }
            onSelectItems={indexList => {
              // Shiftキーを押して複数選択した場合、アイテムインデックスの重複が発生するため、重複分を削除する
              const itemIndexList = Array.from(new Set(indexList))
              // エラー抑制：nodeを選択し、ctrl + マウスクリックで選択されているnodeを選択するとエラーになる
              if (itemIndexList.length === 0) {
                return
              }

              setSelectedItems(itemIndexList)

              // ctrl + マウスクリックでマルチセレクトができるが、
              // 最後選択したアイテムだけ処理対象にする
              const item =
                treeItemsData[itemIndexList[itemIndexList.length - 1]]
              const folderItem = item.hasChildren
                ? item
                : getParentItem(treeItemsData, item.index)
              setSelectedFolderData({
                id: folderItem.index,
                item: folderItem
              })
            }}
            onDrop={handleDropItem}
            // フォルダのアイコンは<MenuItemFolder>に描画済みのため、ここにはあえて描画しない
            renderItemArrow={() => null}
            renderItemTitle={props => (
              <ItemContainer
                isFocused={focusedItem === props.item.index}
                isSelected={selectedItems.includes(props.item.index)}
                isDraggingOver={props.context.isDraggingOver}
                hasChildren={props.item.hasChildren}
              >
                <MenuItem
                  {...props}
                  menuItemFolderContextMenuProps={{
                    treeItemsData,
                    setTreeItemsData,
                    selectedItemData,
                    setSelectedItemData,
                    openUpdateFolderModal: () => {
                      setIsAddFolder(false)
                      setIsUpdateFolderModalOpen(true)
                    }
                  }}
                />
              </ItemContainer>
            )}
            renderDragBetweenLine={({ draggingPosition, lineProps }) => (
              <BetweenLine
                {...lineProps}
                targetType={draggingPosition.targetType}
                linePosition={draggingPosition.linePosition}
                depth={draggingPosition.depth}
              />
            )}
            renderTreeContainer={({ children, containerProps }) => (
              <TreeContainer {...containerProps}>{children}</TreeContainer>
            )}
          >
            <Tree treeId={TREE_ID} rootItem={TREE_ROOT_INDEX} />
          </ControlledTreeEnvironment>
        </MenuEditContainer>
        <DeleteArea ref={ref} onDrop={() => handleOnDropDeleteArea()}>
          <Text>{t('dataAdmin.deleteAreaDescription')}</Text>
        </DeleteArea>
        {/* フォルダ追加・フォルダ名変更 */}
        {isUpdateFolderModalOpen && (
          <UpdateFolderModal
            onSave={(name, isAddFolder) => {
              updateFolder(name, isAddFolder)
            }}
            chkDuplicateName={chkDuplicateName}
            onClose={() => setIsUpdateFolderModalOpen(false)}
            selectedItemData={selectedItemData}
            selectedNodeData={selectedFolderData}
            isAddFolder={isAddFolder}
            t={t}
          />
        )}
        {/* ファイル一括削除 */}
        {isOpenMenuItemModal && (
          <MenuItemDeleteModal
            onClose={() => setIsOpenMenuItemModal(false)}
            treeItemsData={treeItemsData}
            setTreeItemsData={setTreeItemsData}
            resetSelectedData={resetSelectedData}
          />
        )}
      </>
    </ClickOutside>
  )
}

export const MenuEdit: FC<MenuEditProps> = memo<MenuEditProps>(Menu)
