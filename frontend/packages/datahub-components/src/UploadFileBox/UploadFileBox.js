// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { useState } from 'react'
import styled from 'styled-components'
import { Box, Flex } from '@ehv/design-system'

import UploadDND, { type UploadDNDFileType } from '../UploadDND'

type UploadFileBoxType = {
  /** inputタグのaccept属性の値を指定する */
  acceptedTypes?: string,
  height?: string,
  width?: string,
  /** 複数ファイルのアップロードを許可する場合はtrue */
  multiple?: boolean,
  onAddFiles: (Array<UploadDNDFileType>) => void,
  renderContent: () => Node | string
}

const UploadArea = styled(Flex)`
  box-sizing: border-box;
  height: ${props => props.height || '90px'};
  border: ${({ isOver }) => (isOver ? 'solid 1px' : 'dashed 2px')} #d8d8d8;
  background-color: ${({ isOver }) =>
    isOver ? 'rgba(0, 0, 0, 0.1)' : '#f6f6f6'};
  border-radius: 6px;
  box-shadow: ${({ isOver }) =>
    isOver ? '3px 3px 3px -3px rgba(0, 0, 0, 0.3) inset' : 0};
`

export const UploadFileBox = ({
  onAddFiles,
  renderContent,
  multiple = false,
  height,
  width,
  acceptedTypes
}: UploadFileBoxType) => {
  const [isOver, setIsOver] = useState(false)
  return (
    <Box width={width}>
      <UploadDND
        onDND={onAddFiles}
        multiple={multiple}
        canAlwaysClick
        onChangeIsOver={setIsOver}
        acceptedTypes={acceptedTypes}
      >
        <div>
          <UploadArea
            alignItems='center'
            justifyContent='center'
            height={height}
            isOver={isOver}
          >
            {renderContent()}
          </UploadArea>
        </div>
      </UploadDND>
    </Box>
  )
}
