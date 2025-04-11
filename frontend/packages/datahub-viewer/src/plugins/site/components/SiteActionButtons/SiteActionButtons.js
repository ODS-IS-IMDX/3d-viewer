// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'

import { Accordion } from '@ehv/datahub-components'
import { IconTransparentImage } from '@ehv/datahub-icons'

import { FileUploadModalOpenButton } from 'plugins/file/components/FileUploadModalOpenButton'

type SiteActionButtonsProps = {|
  hasAccessToken: boolean
|}

const SiteActionButtons = (props: SiteActionButtonsProps) => {
  const { hasAccessToken } = props

  // アクセストークンがない場合(公開ページの場合)、アセットと注釈追加ボタンを表示しない
  if (!hasAccessToken) {
    return null
  }

  return (
    <Accordion.Item.Header
      {...props}
      cursor='auto'
      disabled
      Icon={IconTransparentImage}
    >
      <FileUploadModalOpenButton />
    </Accordion.Item.Header>
  )
}

export default SiteActionButtons
