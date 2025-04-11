// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import { FileUploadModalOpenButton } from 'plugins/file/components/FileUploadModalOpenButton'

export type AddItemMenuProps = {
  onClickItem: (menu: string) => void
}

export const AddItemMenu = ({ t, onClickItem, ...props }: AddItemMenuProps) => {
  return <FileUploadModalOpenButton />
}

export default AddItemMenu
