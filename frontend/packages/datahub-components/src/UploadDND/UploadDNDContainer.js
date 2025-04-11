// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { Box } from '@ehv/design-system'

import type { UploadDNDFileType } from './utils/getFiles'

export type UploadDNDContainerProps = {
  acceptedTypes?: string,
  canAlwaysClick: boolean,
  canDrop: boolean,
  children: Node | string,
  clickDisabled: boolean,
  connectDropTarget: (Node | string) => Node,
  directory: boolean,
  isOver: boolean,
  multiple: boolean,
  onChangeIsOver: boolean => void,
  onChangeShowOverlay: boolean => void,
  onDND: (Array<UploadDNDFileType>) => void
}

type AddFileEvent = {
  files: Array<{
    webkitRelativePath: string,
    size: number,
    name: string,
    type: string,
    file: {}
  }>
}

const HiddenBox = styled.div`
  display: none;
`

class UploadDNDContainer extends React.PureComponent<UploadDNDContainerProps> {
  inputFile: any = React.createRef()

  componentDidUpdate (prevProps: UploadDNDContainerProps) {
    const { isOver, canDrop, onChangeShowOverlay, onChangeIsOver } = this.props
    if (prevProps.isOver !== isOver) {
      onChangeShowOverlay(canDrop ? isOver : false)
      onChangeIsOver && onChangeIsOver(isOver)
    }
  }

  handleSelectFile = (event: { target: AddFileEvent }) => {
    const addedFiles: Array<UploadDNDFileType> = []
    for (let i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i]
      addedFiles.push({
        file: file,
        name: file.name,
        type: file.type,
        size: file.size,
        fullPath: file.webkitRelativePath || file.name,
        fileSystemName: null
      })
    }
    this.props.onDND(addedFiles)
  }

  handleClick = () => {
    const {
      canAlwaysClick,
      clickDisabled,
      canDrop,
      multiple,
      directory
    } = this.props
    if (canAlwaysClick || (!clickDisabled && canDrop)) {
      // The accept props is not working when using webkitdirectory
      this.inputFile.current.webkitdirectory = directory
      this.inputFile.current.multiple = multiple
      this.inputFile.current.value = ''
      this.inputFile.current.click()
    }
  }

  render () {
    const { connectDropTarget, children, acceptedTypes } = this.props

    return (
      <Box onClick={this.handleClick}>
        {/* $FlowFixMe */}
        {connectDropTarget(children)}
        {/* $FlowFixMe */}
        <HiddenBox>
          <input
            ref={this.inputFile}
            type='file'
            id='uploadfile'
            accept={acceptedTypes}
            onChange={this.handleSelectFile}
          />
        </HiddenBox>
      </Box>
    )
  }
}

export default UploadDNDContainer
