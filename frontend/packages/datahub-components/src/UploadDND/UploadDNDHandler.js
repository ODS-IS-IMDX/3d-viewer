// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import { DropTarget, DndProvider } from 'react-dnd'
import HTML5Backend, { NativeTypes } from 'react-dnd-html5-backend-filedrop'
import { getFilesFromFileDataTransfer } from './utils/fileUtils'
import { getFilesFromFiles } from './utils/filesListUtils'
import UploadDNDContainer from './UploadDNDContainer'
import type { UploadDNDProps } from './UploadDND'

type UploadDNDHandlerProps = {
  ...UploadDNDProps,
  onChangeShowOverlay: boolean => void,
  showOverlay: boolean
}

const dropHandler = async (props, monitor) => {
  if (monitor.didDrop()) {
    return
  }

  if (typeof props.onDND === 'function') {
    const item = monitor.getItem()

    try {
      let result = []
      if (item.dataTransfer) {
        result = await getFilesFromFileDataTransfer(item.dataTransfer)
      } else {
        // 抽出したアイテムがFileの配列の場合
        result = await getFilesFromFiles(item.files)
      }
      props.onDND(result)
    } catch (err) {
      if (typeof props.onError === 'function') {
        return props.onError(err)
      }
    }
  }

  props.onChangeShowOverlay(false)
  return { moved: true }
}

const uploadTarget = {
  drop: (props, monitor) => {
    dropHandler(props, monitor)
  },
  canDrop (props) {
    return props.canDrop
  }
}

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: false }),
  canDrop: monitor.canDrop(),
  itemType: monitor.getItemType()
})

const TargetedUploadDNDContainer = DropTarget(
  [NativeTypes.FILE],
  uploadTarget,
  collect
)(UploadDNDContainer)

const UploadDNDHandlerContainer = (props: UploadDNDHandlerProps) => (
  <DndProvider backend={HTML5Backend}>
    <TargetedUploadDNDContainer {...props} />
  </DndProvider>
)

export default UploadDNDHandlerContainer
